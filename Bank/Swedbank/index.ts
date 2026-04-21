import { core } from "core"
import { CsvParser } from "../../lib"

export class Swedbank {
	static parseCsv(accountId: number, batchId: number, csv: string): core.Transaction.Create[] {
		const parser = new CsvParser<
			| "Radnummer"
			| "Clearingnummer"
			| "Kontonummer"
			| "Produkt"
			| "Valuta"
			| "Bokföringsdag"
			| "Transaktionsdag"
			| "Valutadag"
			| "Referens"
			| "Beskrivning"
			| "Belopp"
			| "Bokfört saldo",
			core.Transaction.Create
		>(
			{ separator: ",", headerColumnIndex: 1 },
			{
				accountId: () => accountId,
				batchId: () => batchId,
				date: row => new Date(row.Transaktionsdag),
				type: () => undefined,
				amount: row => Number(row.Belopp),
				balance: row => Number(row["Bokfört saldo"]),
				description: row => row.Beskrivning,
				reference: row => row.Referens,
				currency: () => "SEK",
				orderInBatch: (_, rowIndex, rows) => {
					const order = rows.at(0)!.Transaktionsdag < rows.at(-1)!.Transaktionsdag ? "asc" : "desc"
					return order == "asc" ? rowIndex : rows.length - rowIndex - 1
				},
				raw: row => row,
			}
		)
		return parser.parse(csv)
	}
}
