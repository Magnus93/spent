import { core } from "core"
import { Repository } from "Repository"

export class Transaction {
	constructor(private readonly repository: Repository) {}

	async createBatch({ accountId, transactions }: core.Batch.Create) {
		this.repository.db.transaction(async tx => {
			const batch = await this.repository.batch.create(accountId, { tx })
			// await this.repository.transaction.createMany(accountId, batch.id, transactions, { tx })
		})
	}
}
