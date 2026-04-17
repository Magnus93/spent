import { core } from "core"
import { Repository } from "Repository"

export class Account {
	constructor(private readonly repository: Repository) {}

	async create(account: core.Account.Create) {
		return await this.repository.account.create(account)
	}

	async list(): Promise<core.Account[]> {
		return await this.repository.account.list()
	}
}
