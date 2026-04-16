import { relations } from "drizzle-orm"
import { accounts } from "./accounts"
import { imports } from "./imports"
import { transactions } from "./transactions"

export const accountsRelations = relations(accounts, ({ many }) => ({
	transactions: many(transactions),
}))
export const importRelations = relations(imports, ({ many }) => ({
	transactions: many(transactions),
}))
export const transactionRelations = relations(transactions, ({ one }) => ({
	accounts: one(accounts),
	["import"]: one(imports),
}))
