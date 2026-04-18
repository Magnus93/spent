import { Account } from "./Account"
import { Transaction } from "./Transaction"

export interface Batch {
	id: number
	importedAt: Date
	account: Account
}
export namespace Batch {
	export const dummy = null

	export interface WithTransaction extends Batch {
		transactions: Transaction[]
	}

	export interface Create {
		accountId: number
		transactions: Transaction.Create[]
	}
}
