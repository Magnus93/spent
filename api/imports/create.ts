import { app } from "app"

app.post("/batch", async context => {
	const service = context.get("service")
	return context.json(await service.account.list())
})
