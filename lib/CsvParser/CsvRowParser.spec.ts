import { CsvRowParser } from "./CsvRowParser"

describe("CsvRowParser", () => {
	it("parse", () => {
		const rowParser = new CsvRowParser({ separator: "," })
		const cells = rowParser.parse(`2025-04-01,-80,900,glass  	,"a, b, c"`)
		expect(cells).toEqual(["2025-04-01", "-80", "900", "glass", "a, b, c"])
	})
})
