import { CsvRowParser } from "./CsvRowParser"

type Map<H extends string, T, K extends keyof T> = (
	row: Record<H, string>,
	rowIndex: number,
	allRows: Record<H, string>[]
) => T[K]

type CsvMapper<H extends string, T> = {
	[K in keyof T]: Map<H, T, K>
}

export class CsvParser<H extends string, T> {
	private readonly separator: string
	private readonly headerColumnIndex: number
	private rowParser: CsvRowParser
	constructor(
		options: { separator: string; headerColumnIndex?: number },
		private readonly mapper: CsvMapper<H, T>
	) {
		this.separator = options.separator
		this.headerColumnIndex = options.headerColumnIndex ?? 0
		this.rowParser = new CsvRowParser({ separator: this.separator })
	}

	parse(input: string): T[] {
		const lines = input.split("\n")
		const headers = lines[this.headerColumnIndex]!.split(this.separator) as H[]
		console.log("headers", headers)
		const rowStrings = lines.slice(this.headerColumnIndex + 1)
		const r = rowStrings.map(
			(rowString): Record<H, string> =>
				Object.fromEntries(this.rowParser.parse(rowString).map((cell, columnIndex) => [headers[columnIndex], cell]))
		)
		return r.map((r, index, all) => this.mapRow(r, index, all))
	}

	private mapRow(row: Record<H, string>, rowIndex: number, allRows: Record<H, string>[]): T {
		const result = {} as T
		for (const key in this.mapper) {
			const map = this.mapper[key]
			result[key] = map(row, rowIndex, allRows)
		}
		return result
	}
}
