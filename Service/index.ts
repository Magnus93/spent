import { Repository } from "Repository"
import { Account } from "./Account"
import { Transaction } from "./Transaction"

export class Service {
	#account?: Account
	get account(): Account {
		return (this.#account ??= new Account(this.repository))
	}

	#transaction?: Transaction
	get transaction(): Transaction {
		return (this.#transaction ??= new Transaction(this.repository))
	}

	constructor(
		private readonly repository: Repository,
		private readonly system: "local" | "production"
	) {}
}
