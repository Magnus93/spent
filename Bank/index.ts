import { core } from "core"
import { HTTPException } from "hono/http-exception"
import { Icabanken as BankIcabanken } from "./Icabanken"
import { Swedbank as BankSwedbank } from "./Swedbank"

export namespace Bank {
	export const Icabanken = BankIcabanken
	export const Swedbank = BankSwedbank

	export type Type = "icabanken" | "swedbank"
	export function parseCsv(bank: Type, accountId: number, batchId: number, csv: string): core.Transaction.Create[] {
		let result: core.Transaction.Create[]
		switch (bank) {
			case "icabanken":
				result = Icabanken.parseCsv(accountId, batchId, csv)
				break
			case "swedbank":
				result = Swedbank.parseCsv(accountId, batchId, csv)
				console.log("swedank txs", result)
				break
			default:
				throw new HTTPException(404, { message: `No bank support for "${bank}"` })
		}
		return result
	}
}
