import { core } from "core"
import * as drizzle from "drizzle-orm"
import { DB } from "./DB"

export class Account {
	constructor(private readonly db: DB) {}

	async create(account: core.Account.Create): Promise<core.Account> {
		const [result] = await this.db
			.insert(DB.schema.accounts)
			.values(Account.fromCore(account))
			.returning()
			.catch(e => {
				throw this.handleError("Failure during repository.account.create", e)
			})
		if (!result) {
			throw this.handleError(`Failed to create account ${account.sort}-${account.accountNumber}`)
		}
		return Account.toCore(result)
	}

	async list(): Promise<core.Account[]> {
		return await this.db
			.select()
			.from(DB.schema.accounts)
			.then(r => r.map(Account.toCore))
			.catch(e => {
				throw this.handleError("Failure during repository.account.create", e)
			})
	}

	handleError(message: string, error?: Error) {
		const fullMessage = `${message}\n${error?.message}`
		console.log(fullMessage, error?.cause)
		return new Error(fullMessage, { cause: error?.cause })
	}
}

export namespace Account {
	export function fromCore(account: core.Account.Create): drizzle.InferInsertModel<typeof DB.schema.accounts> {
		return {
			sort: account.sort,
			account_number: account.accountNumber,
			type: account.type,
			bank: account.bank,
		}
	}
	export function toCore(row: drizzle.InferSelectModel<typeof DB.schema.accounts>): core.Account {
		return {
			id: row.id,
			sort: row.sort,
			accountNumber: row.account_number,
			type: row.type as core.Account["type"],
			bank: row.bank,
		}
	}
}
