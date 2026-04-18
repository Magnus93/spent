import { core } from "core"
import * as drizzle from "drizzle-orm"
import { DB } from "./DB"

export class Transaction {
	constructor(private readonly db: DB) {}

	async list(options?: { tx?: DB; filter?: Transaction.Filter }): Promise<core.Transaction[]> {
		const db = options?.tx ?? this.db
		const rows = await db
			.select()
			.from(DB.schema.transactions)
			.where(Transaction.Filter.where(options?.filter))
			.catch(e => {
				throw Error("Failure during list", { cause: e.cause })
			})
		return rows.map(Transaction.toCore)
	}

	async upsertMany(accountId: number, batchId: number, transactions: core.Transaction.Create[], options: { tx: DB }) {
		return await options.tx
			.insert(DB.schema.transactions)
			.values(transactions.map(t => Transaction.fromCore(accountId, batchId, t)))
			.returning()
			.then(rows => rows.map(Transaction.toCore))
			.catch(e => {
				throw Error("Failure during repository.Transaction.upsertMany", { cause: e.cause })
			})
	}
}

export namespace Transaction {
	export function fromCore(
		accountId: number,
		batchId: number,
		transaction: core.Transaction.Create
	): drizzle.InferInsertModel<typeof DB.schema.transactions> {
		return {
			account_id: accountId,
			batch_id: batchId,
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
		accountId?: number
		batchId?: number
		date?: { after?: Date; before?: Date }
		amount?: { min?: number; max?: number }
	}
	export namespace Filter {
		export function where(filter?: Filter) {
			if (!filter) {
				return undefined
			}
			const predicates: (drizzle.SQL | undefined)[] = []
			if (typeof filter.accountId == "number") {
				predicates.push(drizzle.eq(DB.schema.transactions.account_id, filter?.accountId))
			}
			if (typeof filter.batchId == "number") {
				predicates.push(drizzle.eq(DB.schema.transactions.batch_id, filter?.batchId))
			}
			if (filter.date?.after) {
				predicates.push(drizzle.gte(DB.schema.transactions.date, filter.date.after))
			}
			if (filter.date?.before) {
				predicates.push(drizzle.lte(DB.schema.transactions.date, filter.date.before))
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
