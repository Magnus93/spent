import { PostgresJsDatabase } from "drizzle-orm/postgres-js"
import * as dBSchema from "./schema"

export type DB = PostgresJsDatabase<typeof dBSchema>

export namespace DB {
	export const schema = dBSchema
}
