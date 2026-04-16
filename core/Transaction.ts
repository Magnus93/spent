import { createHash } from "crypto"

export interface Transaction {
	id: string
	accountId: string
	// fingerprint: string
	date: Date
	importId: string
	importOrder: number
	type: "deposit" | "transfer" | "card_transaction" | "misc"
	amount: number
	balance: number
	currency: "SEK"
	description: string
	reference?: string
}

export namespace Transaction {
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
