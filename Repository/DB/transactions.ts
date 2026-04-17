import { bigint, bigserial, integer, jsonb, numeric, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core"
import { accounts } from "./accounts"
import { imports } from "./imports"

export const transactions = pgTable(
	"transactions",
	{
		id: bigserial("id", { mode: "number" }).primaryKey(),
		account_id: bigint("account_id", { mode: "bigint" })
			.notNull()
			.references(() => accounts.id),
		fingerprint: text("fingerprint").notNull(),
		type: text("type"),
		import_id: bigint("import_id", { mode: "bigint" })
			.notNull()
			.references(() => imports.id),
		import_order: integer("import_order").notNull(),
		amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
		balance: numeric("balance", { precision: 12, scale: 2 }).notNull(),
		currency: text("currency"),
		description: text("description").notNull(),
		reference: text("reference"),
		date: timestamp("date", { mode: "date" }).notNull(),
		raw_payload: jsonb("raw_payload").notNull(),
	},
	table => ({
		accountFingerPrintIdx: uniqueIndex("transactions_account_fp_idx").on(table.account_id, table.fingerprint),
	})
)
