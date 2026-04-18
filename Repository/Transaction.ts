import { core } from "core"
import * as drizzle from "drizzle-orm"
import { DB } from "./DB"

export class Transaction {
	constructor(private readonly db: DB) {}

	async upsertMany(accountId: number, batchId: number, transactions: core.Transaction.Create[], options: { tx: DB }) {
		return await options.tx
			.insert(DB.schema.transactions)
			.values(transactions.map(t => Transaction.fromCore(accountId, batchId, t)))
			.returning()
			.then(r => r.map(Transaction.toCore))
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
}
