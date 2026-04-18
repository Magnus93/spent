import { core } from "core"
import { Repository } from "Repository"

export class Transaction {
	constructor(private readonly repository: Repository) {}

	async createBatch({ accountId, transactions }: core.Batch.Create): Promise<core.Batch.WithTransaction> {
		return this.repository.db.transaction(async tx => {
			const batch = await this.repository.batch.create(accountId, { tx })
			const newTransactions = await this.repository.transaction.upsertMany(accountId, batch.id, transactions, { tx })
			return { ...batch, transactions: newTransactions }
		})
	}
}
