import dotenv from "dotenv"
import type { Config } from "drizzle-kit"

import "dotenv/config"

dotenv.config({ path: ".env.local" })

export default {
	schema: "./Repository/DB/schema.ts",
	out: "./_db/migrations",
	dialect: "postgresql",
	dbCredentials: {
		url: process.env.DATABASE_URL!,
	},
} satisfies Config
