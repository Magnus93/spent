import { CsvParser } from "./index"

interface TX {
	amount: number
	date: string
	balance: number
	reference: string
	description: string
	orderInBatch: number
}
const csv = `* Transaktioner Period 2025-01-012025-12-31 Skapad 2026-04-01 22:30 CEST
datum;belopp;saldo;referens;beskrivning;
2025-06-01;-120;2730;lunch   ;"sop m. bröd"
2025-05-01;2000;2850;en slant   ;"insätt."
2025-04-01;-50;850;mer glass	;"mer glass"
2025-04-01;-80;900;glass	;"a; b; c"
2025-03-01;-20;980;en soda     ;"coca-cola"`
const transactions = [
	{ date: "2025-06-01", amount: -120, balance: 2730, reference: "lunch", description: "sop m. bröd", orderInBatch: 4 },
	{ date: "2025-05-01", amount: 2000, balance: 2850, reference: "en slant", description: "insätt.", orderInBatch: 3 },
	{ date: "2025-04-01", amount: -50, balance: 850, reference: "mer glass", description: "mer glass", orderInBatch: 2 },
	{ date: "2025-04-01", amount: -80, balance: 900, reference: "glass", description: "a; b; c", orderInBatch: 1 },
	{ date: "2025-03-01", amount: -20, balance: 980, reference: "en soda", description: "coca-cola", orderInBatch: 0 },
]

describe("CSV", () => {
	const parser = new CsvParser<"datum" | "belopp" | "saldo" | "referens" | "beskrivning", TX>(
		{ separator: ";", headerColumnIndex: 1 },
		{
			date: row => row.datum,
			amount: row => Number(row.belopp),
			balance: row => Number(row.saldo),
			reference: row => row.referens,
			description: row => row.beskrivning,
			orderInBatch: (_, rowIndex, rows) => {
				const order = rows.at(0)!.datum < rows.at(-1)!.datum ? "asc" : "desc"
				return order == "asc" ? rowIndex : rows.length - rowIndex - 1
			},
		}
	)
	it("parse", () => {
		expect(parser.parse(csv)).toEqual(transactions)
	})
})
