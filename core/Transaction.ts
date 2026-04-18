import { createHash } from "crypto"

export interface Transaction {
	id: string
	accountId: string
	// fingerprint: string
	date: Date
	batchId: string
	orderInBatch: number
	type: Transaction.Type
	amount: number
	balance: number
	currency: "SEK"
	description: string
	reference?: string
	raw: any
}

export namespace Transaction {
	export interface Create {
		date: Date
		batchId: string
		orderInBatch: number
		type: Type
		amount: number
		balance: number
		currency: "SEK"
		description: string
		reference?: string
		raw?: any
	}
	export type Type = "deposit" | "transfer" | "card_transaction" | "misc"
	export namespace Fingerprint {
		export function create({ accountId, date, amount, description, balance, currency }: Transaction) {
			const normalizedDescription = description
				.toLowerCase()
				.trim()
				.replace(/( |\t)/g, "")
			const normalizedAmount = amount.toFixed(2)
			const normalizedBalance = balance.toFixed(2)
			return createHash("sha256")
				.update(`${accountId}|${date}|${normalizedAmount}|${currency}|${normalizedDescription}|${normalizedBalance}`)
				.digest("hex")
		}
	}
}
