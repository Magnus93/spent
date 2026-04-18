type Map<H extends string, T, K extends keyof T> = (row: Record<H, string>, rowIndex: number) => T[K]

type CsvMapper<H extends string, T> = {
	[K in keyof T]: Map<H, T, K>
}

export class CsvParser<H extends string, T> {
	constructor(
		private readonly separator: string,
		private readonly mapper: CsvMapper<H, T>,
		private readonly headerColumnIndex = 0
	) {}

	parse(input: string): T[] {
		const lines = input.split("\n")
		const headers = lines[this.headerColumnIndex]!.split(this.separator) as H[]
		const rows = lines.slice(this.headerColumnIndex + 1)
		console.log("rows", rows)
		return rows.map((rowString, index) => {
			const row: Record<H, string> = Object.fromEntries(
				rowString.split(this.separator).map((cell, columnIndex) => [headers[columnIndex], cell])
			)
			return this.parseRow(row, index)
		})
	}
	private parseRow(row: Record<H, string>, rowIndex: number): T {
		const result = {} as T
		for (const key in this.mapper) {
			const map = this.mapper[key]
			result[key] = map(row, rowIndex)
		}
		return result
	}
}
