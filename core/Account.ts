export interface Account {
	id: string // not on Creatable
	sort: string
	accountNumber: string
	bank: string
	type: "card" | "saving"
}
export namespace Account {
	export const dummy = null
}
