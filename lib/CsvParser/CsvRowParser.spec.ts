import { CsvRowParser } from "./CsvRowParser"

describe("CsvRowParser", () => {
	it.each([
		[
			`2025-04-01,-80,900,  trim extra space around cell       	,abc"`,
			["2025-04-01", "-80", "900", "trim extra space around cell", "abc"],
		],
		[
			`2025-04-01,-80,900,qoutes with separator inside  	,"a, b, c"`,
			["2025-04-01", "-80", "900", "qoutes with separator inside", "a, b, c"],
		],
		[
			`2025-12-30,,Empty cell in row,6 000.00 kr,7 129.17 kr`,
			["2025-12-30", "", "Empty cell in row", "6 000.00 kr", "7 129.17 kr"],
		],
		[
			`2025-12-30,Empty cell in last cell,6 000.00 kr,7 129.17 kr,`,
			["2025-12-30", "Empty cell in last cell", "6 000.00 kr", "7 129.17 kr", ""],
		],
		[
			`2026-04-12;empty last cell ;Reserverat belopp;-40,00 kr;`,
			["2026-04-12", "empty last cell", "Reserverat belopp", "-40,00 kr", ""],
			";",
		],
	])("parse", (rowString, expected, separator?: string) => {
		const rowParser = new CsvRowParser({ separator: separator ?? "," })
		const cells = rowParser.parse(rowString)
		expect(cells).toEqual(expected)
	})
})
