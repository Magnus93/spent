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
		let currentCell: string = ""
		while ((this.cursor = this.next())) {
			if (this.cursor.char == this.separator) {
				cells.push(currentCell.trim())
				currentCell = ""
			} else if (this.cursor.char == `"`) {
				currentCell = this.readUntil(`"`)
				cells.push(currentCell.trim())
				currentCell = ""
			} else {
				currentCell = currentCell + this.cursor.char
			}
		}
		return cells
	}

	readUntil(stopAt: string): string {
		let result = ""
		while ((this.cursor = this.next())) {
			if (this.cursor.char == stopAt) {
				break
			}
			result = result + this.cursor.char
		}
		return result
	}
}
