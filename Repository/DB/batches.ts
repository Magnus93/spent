import { bigserial, pgTable, timestamp } from "drizzle-orm/pg-core"
import { accounts } from "./accounts"

export const batches = pgTable("batches", {
	id: bigserial("id", { mode: "number" }).primaryKey().notNull(),
	account_id: bigserial("account_id", { mode: "number" })
		.notNull()
		.references(() => accounts.id),
	imported_at: timestamp("imported_at", { mode: "date" }).notNull(),
})
