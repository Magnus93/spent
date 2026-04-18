import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import { Account } from "./Account"
import { Batch } from "./Batch"
import { DB as RepositoryDB } from "./DB"
import { Transaction } from "./Transaction"

export class Repository {
	public db: RepositoryDB
	public readonly account: Account
	public readonly batch: Batch
	public readonly transaction: Transaction

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
		this.account = new Account(this.db)
		this.batch = new Batch(this.db)
		this.transaction = new Transaction(this.db)
	}
}

export namespace Repository {
	export type DB = RepositoryDB
}
