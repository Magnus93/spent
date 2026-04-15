import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import { Account } from "./Account"
import { DB as RepositoryDB } from "./DB"

export class Repository {
	public db: RepositoryDB
	public readonly account: Account

	constructor(hyperdrive: Hyperdrive) {
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
	}
}

export namespace Repository {
	export type DB = RepositoryDB
}
