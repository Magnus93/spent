import { Bank } from "Bank"
import { core } from "core"
import { Repository } from "Repository"
export class Transaction {
	constructor(private readonly repository: Repository) {}

	async createBatch(bank: Bank.Type, accountId: number, csv: string): Promise<core.Batch.WithTransaction> {
		return this.repository.db.transaction(async tx => {
			const batch = await this.repository.batch.create(accountId, { tx })
			const transactions = Bank.parseCsv(bank, accountId, batch.id, csv)
			const newTransactions = await this.repository.transaction.upsertMany(accountId, transactions, { tx })
			return { ...batch, transactions: newTransactions }
		})
	}
	async list(filter?: Repository.Transaction.Filter) {
		return this.repository.transaction.list({ filter })
	}
}
