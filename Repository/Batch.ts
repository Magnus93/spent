import { core } from "core"
import * as drizzle from "drizzle-orm"
import { HTTPException } from "hono/http-exception"
import { ContentfulStatusCode } from "hono/utils/http-status"
import { Account } from "./Account"
import { DB } from "./DB"

export class Batch {
	constructor(private readonly db: DB) {}

	async create(accountId: number, options: { tx: DB }): Promise<core.Batch> {
		const [batchRow] = await options.tx
			.insert(DB.schema.batches)
			.values(Batch.fromCore(accountId))
			.returning()
			.catch(e => {
				throw this.handleError(500, "Failure during repository.batch.create", e)
			})
		if (!batchRow) {
			throw this.handleError(500, "No batch returned")
		}
		return this.get(batchRow.id, { tx: options.tx })
	}
	async get(batchId: number, options?: { tx?: DB }): Promise<core.Batch> {
		const db = options?.tx ?? this.db
		const result = await db.query.batches
			.findFirst({
				where: drizzle.eq(DB.schema.batches.id, batchId),
				with: { account: true },
			})
			.catch(e => {
				throw this.handleError(500, "Failure during", e)
			})
		if (!result) {
			throw this.handleError(500, `Failed to get batch ${batchId}`)
		}
		if (!result.account) {
			throw this.handleError(500, "Failed to get account in repository.batch.get")
		}
		return Batch.toCore({ ...result, account: result.account })
	}
	handleError(status: ContentfulStatusCode, message: string, error?: Error) {
		const fullMessage = `${status}: ${message}\n${error?.message}\nCAUSE: ${error?.cause}`
		console.log(fullMessage, error?.cause)
		return new HTTPException(status, { message: fullMessage, cause: error?.cause })
	}
}

export namespace Batch {
	export function fromCore(accountId: number): drizzle.InferInsertModel<typeof DB.schema.batches> {
		return {
			account_id: accountId,
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
