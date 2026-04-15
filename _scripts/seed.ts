import { db } from "../_db/client"
import * as schema from "../Repository/DB/schema"

async function seed() {
	await db.insert(schema.accounts).values([
		{
			sort: "81234",
			account_number: "account_number",
			type: "card",
			bank: "icabanken",
		},
	])
}

seed().then(() => process.exit(0))
