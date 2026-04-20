export class CsvRowParser {
	private readonly separator: string
	private cursor?: { char: string; index: number }
	private rowString: string = ""
	constructor(options: { separator: string }) {
		this.separator = options.separator
	}

	next() {
		const index = !this.cursor ? 0 : this.cursor.index + 1
		const char = this.rowString?.[index]
		return char ? { char, index } : undefined
	}

	parse(rowString: string): string[] {
		this.rowString = rowString
		const cells: string[] = []
		let currentCell = ""
		let inQuotes = false

		while ((this.cursor = this.next())) {
			if (this.cursor.char == `"`) {
				inQuotes = !inQuotes
			} else if (this.cursor.char == this.separator && !inQuotes) {
				cells.push(currentCell.trim())
				currentCell = ""
			} else {
				currentCell += this.cursor.char
			}
		}
		cells.push(currentCell)
		return cells
	}
}
