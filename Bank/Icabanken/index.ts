import { core } from "core"
import { CsvParser } from "../../lib"

export class Icabanken {
	static parseCsv(accountId: number, batchId: number, csv: string): core.Transaction.Create[] {
		const parser = new CsvParser<"Datum" | "Text" | "Typ" | "Belopp" | "Saldo", core.Transaction.Create>(
			{ separator: ";" },
			{
				accountId: () => accountId,
				batchId: () => batchId,
				date: row => new Date(row.Datum),
				type: row =>
					row.Typ == "Insättning"
						? "deposit"
						: row.Typ == "Korttransaktion"
							? "card_transaction"
							: row.Typ == "PG/BG-betalning"
								? "transfer"
								: row.Typ == "Övrigt"
									? "misc"
									: undefined,
				amount: row => this.toAmount(row.Belopp),
				balance: row => (typeof row.Saldo == "string" ? this.toAmount(row.Saldo) : undefined),
				description: row => row.Text,
				currency: () => "SEK",
				orderInBatch: (row, rowIndex, rows) => {
					console.log("csv keys", Object.keys(row))
					const order = rows.at(0)!.Datum < rows.at(-1)!.Datum ? "asc" : "desc"
					return order == "asc" ? rowIndex : rows.length - rowIndex - 1
				},
				raw: row => row,
			}
		)
		return parser.parse(csv)
	}

	static toAmount(text: string): number {
		return Number(text.replace("kr", "").replace(/ /g, "").replace(",", "."))
	}
}
