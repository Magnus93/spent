import { Repository } from "Repository"
import { Account } from "./Account"

export class Service {
	#account?: Account
	get account(): Account {
		return (this.#account ??= new Account(this.repository))
	}

	constructor(
		private readonly repository: Repository,
		private readonly system: "local" | "production"
	) {}
}
