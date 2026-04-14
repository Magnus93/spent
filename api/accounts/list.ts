import { app } from "app"

app.get("/accounts", async context => {
	const service = context.get("service")
	return context.json(await service.account.list())
})
