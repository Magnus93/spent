import { relations } from "drizzle-orm"
import { accounts } from "./accounts"
import { batches } from "./batches"
import { transactions } from "./transactions"

export const accountsRelations = relations(accounts, ({ many }) => ({
	batches: many(batches),
	transactions: many(transactions),
}))
export const batchRelations = relations(batches, ({ many, one }) => ({
	account: one(accounts, { fields: [batches.account_id], references: [accounts.id] }),
	transactions: many(transactions),
}))
export const transactionRelations = relations(transactions, ({ one }) => ({
	account: one(accounts, { fields: [transactions.account_id], references: [accounts.id] }),
	batch: one(batches, { fields: [transactions.batch_id], references: [batches.id] }),
}))
