import dotenv from "dotenv"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "../Repository/DB/schema"

import "dotenv/config"

dotenv.config({ path: ".env.local" })

const sql = postgres(process.env.DATABASE_URL!, {
	max: 5,
	ssl: false,
})

export const db = drizzle(sql, { schema })
