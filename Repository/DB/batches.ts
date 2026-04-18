import { bigserial, pgTable, timestamp } from "drizzle-orm/pg-core"

export const batches = pgTable("batches", {
	id: bigserial("id", { mode: "number" }).primaryKey(),
	imported_at: timestamp("imported_at", { mode: "date" }).notNull(),
})
