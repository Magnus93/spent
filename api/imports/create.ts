import { app } from "app"

app.post("/imports", async context => {
	const service = context.get("service")
	return context.json(await service.account.list())
})
