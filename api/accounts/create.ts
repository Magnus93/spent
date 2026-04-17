import { app } from "app"
import { core } from "core"

app.post("/accounts", async context => {
	const service = context.get("service")
	const account: core.Account.Create = await context.req.json()
	return context.json(await service.account.create(account))
})
