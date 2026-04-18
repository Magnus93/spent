import { core } from "core"
import * as drizzle from "drizzle-orm"
import { DB } from "./DB"

export class Transaction {
	constructor(private readonly db: DB) {}

	/* async createMany(accountId: number, batch_id: number, transactions: core.Transaction.Create[], options: { tx: DB }) {
		options.tx.insert(DB.schema.transactions).values()
	} */
}

export namespace Transaction {
	/* export function fromCore(
		accountId: number,
		transaction: core.Transaction.Create
	): drizzle.InferInsertModel<typeof DB.schema.transactions> {
		return {
			account_id: accountId,
			type: transaction.type,
			// batch_id
			// order_in_batch
			// amount
			// balance
			// currency
			// description
			// reference
			// date
			// raw_payload
		}
	} */
	export function toCore() {}
}
