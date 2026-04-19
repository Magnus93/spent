import { createHash } from "crypto"

export interface Transaction {
	id: number
	accountId: number
	fingerprint: string
	date: Date
	batchId: number
	orderInBatch: number
	type?: Transaction.Type
	amount: number
	balance: number
	currency: "SEK"
	description: string
	reference?: string
	raw: any
}

export namespace Transaction {
	export interface Create {
		accountId: number
		date: Date
		batchId: number
		orderInBatch: number
		type?: Type
		amount: number
		balance?: number
		currency: "SEK"
		description: string
		reference?: string
		raw?: any
	}
	export type Type = "deposit" | "transfer" | "card_transaction" | "misc"
	export namespace Fingerprint {
		export function create(accountId: number, { date, amount, description, balance, currency }: Transaction.Create) {
			const normalizedDescription = description
				.toLowerCase()
				.trim()
				.replace(/( |\t)/g, "")
			const normalizedAmount = amount.toFixed(2)
			const normalizedBalance = balance?.toFixed(2)
			return createHash("sha256")
				.update(`${accountId}|${date}|${normalizedAmount}|${currency}|${normalizedDescription}|${normalizedBalance}`)
				.digest("hex")
		}
	}
}
