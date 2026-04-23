import { core } from "core"
import generateCursor, { CursorConfig } from "drizzle-cursor"
import * as drizzle from "drizzle-orm"
import { HTTPException } from "hono/http-exception"
import { ContentfulStatusCode } from "hono/utils/http-status"
import { DB } from "./DB"

export class Transaction {
	constructor(private readonly db: DB) {}

	async list(options?: {
		tx?: DB
		filter?: Transaction.Filter
		limit?: number
		continuation?: string
	}): Promise<{ result: core.Transaction[]; continuationToken?: string }> {
		const cursorConfig: CursorConfig = {
			cursors: [
				{ order: "DESC", key: "date", schema: DB.schema.transactions.date },
				{ order: "DESC", key: "order_in_batch", schema: DB.schema.transactions.order_in_batch },
			],
			primaryCursor: { order: "DESC", key: "id", schema: DB.schema.transactions.id },
		}
		const cursor = generateCursor(cursorConfig)
		const continueAt = options?.continuation ? cursor.parse(options.continuation) : undefined
		const db = options?.tx ?? this.db
		const rows = await db
			.select()
			.from(DB.schema.transactions)
			.where(drizzle.and(cursor.where(continueAt), Transaction.Filter.where(options?.filter)))
			.orderBy(...cursor.orderBy)
			.limit(options?.limit ?? 100)
			.catch(e => {
				throw this.handleError(500, "Failure during list", e)
			})
		const continuationToken = cursor.serialize(rows.at(-1)) ?? undefined
		return { continuationToken, result: rows.map(Transaction.toCore) }
	}

	async upsertMany(accountId: number, transactions: core.Transaction.Create[], options: { tx: DB }) {
		return await options.tx
			.insert(DB.schema.transactions)
			.values(transactions.map(t => Transaction.fromCore(accountId, t)))
			.onConflictDoUpdate({
				target: DB.schema.transactions.fingerprint,
				set: {
					batch_id: drizzle.sql`excluded.batch_id`,
					order_in_batch: drizzle.sql`excluded.order_in_batch`,
					amount: drizzle.sql`excluded.amount`,
					balance: drizzle.sql`excluded.balance`,
					description: drizzle.sql`excluded.description`,
					reference: drizzle.sql`excluded.reference`,
				},
			})
			.returning()
			.then(rows => rows.map(Transaction.toCore))
			.catch(e => {
				throw this.handleError(500, "Failure during repository.Transaction.upsertMany", e)
			})
	}
	handleError(status: ContentfulStatusCode, message: string, error?: Error) {
		const fullMessage = `${status}: ${message}\n${error?.message}`
		console.log(fullMessage, error?.cause)
		return new HTTPException(status, { message: fullMessage, cause: error?.cause })
	}
}

export namespace Transaction {
	export function fromCore(
		accountId: number,
		transaction: core.Transaction.Create
	): drizzle.InferInsertModel<typeof DB.schema.transactions> {
		return {
			account_id: accountId,
			batch_id: transaction.batchId,
			type: transaction.type,
			fingerprint: core.Transaction.Fingerprint.create(accountId, transaction),
			order_in_batch: transaction.orderInBatch,
			amount: transaction.amount.toFixed(2),
			balance: transaction.balance.toFixed(2),
			currency: transaction.currency,
			description: transaction.description,
			reference: transaction.reference,
			date: transaction.date,
			raw_payload: transaction.raw,
		}
	}
	export function toCore(row: drizzle.InferSelectModel<typeof DB.schema.transactions>): core.Transaction {
		return {
			id: row.id,
			accountId: row.account_id,
			batchId: row.batch_id,
			fingerprint: row.fingerprint,
			type: row.type as core.Transaction["type"],
			amount: Number(row.amount),
			balance: Number(row.balance),
			currency: row.currency as core.Transaction["currency"],
			orderInBatch: row.order_in_batch,
			description: row.description,
			reference: row.reference ?? undefined,
			date: row.date,
			raw: row.raw_payload,
		}
	}
	export interface Filter {
		accountId?: number[]
		batchId?: number[]
		date?: { after?: string; before?: string }
		amount?: { min?: number; max?: number }
	}
	export namespace Filter {
		export function where(filter?: Filter) {
			if (!filter) {
				return undefined
			}
			const predicates: drizzle.SQL[] = []
			if (filter.accountId) {
				predicates.push(drizzle.inArray(DB.schema.transactions.account_id, filter.accountId))
			}
			if (filter.batchId) {
				predicates.push(drizzle.inArray(DB.schema.transactions.batch_id, filter.batchId))
			}
			if (filter.date?.after) {
				predicates.push(drizzle.gte(DB.schema.transactions.date, new Date(filter.date.after)))
			}
			if (filter.date?.before) {
				predicates.push(drizzle.lte(DB.schema.transactions.date, new Date(filter.date.before)))
			}
			if (typeof filter.amount?.min == "number") {
				predicates.push(drizzle.gte(DB.schema.transactions.amount, filter.amount.min.toFixed(2)))
			}
			if (typeof filter.amount?.max == "number") {
				predicates.push(drizzle.lte(DB.schema.transactions.amount, filter.amount.max.toFixed(2)))
			}
			return predicates.length == 0 ? undefined : drizzle.and(...predicates)
		}
	}
}
