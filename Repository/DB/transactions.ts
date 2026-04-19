import { bigint, bigserial, date, integer, jsonb, numeric, pgTable, text, uniqueIndex } from "drizzle-orm/pg-core"
import { accounts } from "./accounts"
import { batches } from "./batches"

export const transactions = pgTable(
	"transactions",
	{
		id: bigserial("id", { mode: "number" }).primaryKey().notNull(),
		account_id: bigint("account_id", { mode: "number" })
			.notNull()
			.references(() => accounts.id),
		fingerprint: text("fingerprint").notNull(),
		type: text("type"),
		batch_id: bigint("batch_id", { mode: "number" })
			.notNull()
			.references(() => batches.id),
		order_in_batch: integer("order_in_batch").notNull(),
		amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
		balance: numeric("balance", { precision: 12, scale: 2 }),
		currency: text("currency").notNull(),
		description: text("description").notNull(),
		reference: text("reference"),
		date: date("date", { mode: "date" }).notNull(),
		raw_payload: jsonb("raw_payload").notNull(),
	},
	table => ({
		accountFingerPrintIdx: uniqueIndex("transactions_account_fp_idx").on(table.account_id, table.fingerprint),
	})
)
