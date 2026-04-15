import { bigserial, pgTable, text } from "drizzle-orm/pg-core"

export const accounts = pgTable("accounts", {
	id: bigserial("id", { mode: "bigint" }).primaryKey(),
	sort: text("sort").notNull(),
	account_number: text("account_number").notNull(),
	type: text("type").notNull(),
	bank: text("bank").notNull(),
})
