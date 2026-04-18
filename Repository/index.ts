import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import { Account as DBAccount } from "./Account"
import { Batch as DBBatch } from "./Batch"
import { DB as RepositoryDB } from "./DB"
import { Transaction as DBTransaction } from "./Transaction"

export class Repository {
	public db: RepositoryDB
	public readonly account: DBAccount
	public readonly batch: DBBatch
	public readonly transaction: DBTransaction

	constructor(hyperdrive: Hyperdrive) {
		console.log("connectionString", hyperdrive.connectionString)
		const sql = postgres(hyperdrive.connectionString, {
			ssl: false,
			max: 5,
			fetch_types: false,
			connection: { TimeZone: "UTC" },
			onnotice: notice => console.log("SQL Notice:", notice),
			transform: { undefined: null },
		})
		this.db = drizzle(sql, { schema: RepositoryDB.schema })
		this.account = new DBAccount(this.db)
		this.batch = new DBBatch(this.db)
		this.transaction = new DBTransaction(this.db)
	}
}

export namespace Repository {
	export type DB = RepositoryDB
	export import Account = DBAccount
	export import Batch = DBBatch
	export import Transaction = DBTransaction
}
