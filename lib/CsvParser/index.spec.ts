import { CsvParser } from "./index"

const csv = `datum;belopp;saldo;beskrivning
2025-06-01;-120;2730;soppa and bröd
2025-05-01;2000;2850;insättning
2025-04-01;-50;850;mer glass
2025-04-01;-80;900;glass
2025-03-01;-20;980;coca-cola`

interface TX {
	amount: number
	date: string
	balance: number
	description: string
	importOrder: number
}

describe("CSV", () => {
	const parser = new CsvParser<"datum" | "belopp" | "saldo" | "beskrivning", TX>(";", {
		date: row => row.datum,
		amount: (row, index) => {
			console.log(row, index)
			return Number(row.belopp)
		},
		balance: row => Number(row.saldo),
		description: row => row.beskrivning,
		importOrder: (_, rowIndex) => rowIndex, // TODO add allRows (we need to know the length of the list)
	})
	it("parse", () => {
		expect(parser.parse(csv)).toEqual([
			{ date: "2025-06-01", amount: -120, balance: 2730, description: "soppa and bröd", importOrder: 4 },
			{ date: "2025-05-01", amount: 2000, balance: 2850, description: "insättning", importOrder: 3 },
			{ date: "2025-04-01", amount: -50, balance: 850, description: "mer glass", importOrder: 2 },
			{ date: "2025-04-01", amount: -80, balance: 900, description: "glass", importOrder: 1 },
			{ date: "2025-03-01", amount: -20, balance: 980, description: "coca-cola", importOrder: 0 },
		])
	})
})
