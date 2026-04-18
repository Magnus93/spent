import { app } from "app"

app.get("/transactions", async context => {
	const service = context.get("service")
	const accountId = context.req.query("account") ? Number(context.req.query("account")) : undefined
	return context.json(await service.transaction.list({ accountId }))
})
