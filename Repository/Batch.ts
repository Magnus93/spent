import { core } from "core"
import * as drizzle from "drizzle-orm"
import { Account } from "./Account"
import { DB } from "./DB"

export class Batch {
	constructor(private readonly db: DB) {}

	async create(accountId: number, options: { tx: DB }): Promise<core.Batch> {
		const [batchRow] = await options.tx.insert(DB.schema.batches).values(Batch.fromCore(accountId)).returning()
		if (!batchRow) {
			throw Error("Fail!") // TODO handle better
		}
		return this.get(batchRow.id)
	}
	async get(batchId: number, options?: { tx?: DB }): Promise<core.Batch> {
		const db = options?.tx ?? this.db
		const result = await db.query.batches.findFirst({
			where: drizzle.eq(DB.schema.batches, batchId),
			with: { account: true },
		})
		if (!result) {
			throw Error("Fail no batch") // TODO handle better
		}
		if (!result.account) {
			throw Error("no account") // TODO handle better
		}
		return Batch.toCore({ ...result, account: result.account })
	}
}

export namespace Batch {
	export function fromCore(accountId: number): drizzle.InferInsertModel<typeof DB.schema.batches> {
		return {
			imported_at: new Date(),
		}
	}
	type BatchRowWithAccount = drizzle.InferSelectModel<typeof DB.schema.batches> & {
		account: drizzle.InferSelectModel<typeof DB.schema.accounts>
	}
	export function toCore(row: BatchRowWithAccount): core.Batch {
		return {
			id: row.id,
			importedAt: row.imported_at,
			account: Account.toCore(row.account),
		}
	}
}
