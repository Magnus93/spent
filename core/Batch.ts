export interface Account extends Account.Create {
	id: number
}
export namespace Account {
	export const dummy = null

	export interface Create {
		sort: string
		accountNumber: string
		bank: string
		type: "card" | "saving"
	}
}
