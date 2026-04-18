import { relations } from "drizzle-orm"
import { accounts } from "./accounts"
import { batches } from "./batches"
import { transactions } from "./transactions"

export const accountsRelations = relations(accounts, ({ many }) => ({
	batches: many(batches),
	transactions: many(transactions),
}))
export const batchRelations = relations(batches, ({ many, one }) => ({
	account: one(accounts),
	transactions: many(transactions),
}))
export const transactionRelations = relations(transactions, ({ one }) => ({
	account: one(accounts),
	batch: one(batches),
}))
