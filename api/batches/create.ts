import { app } from "app"
import { HTTPException } from "hono/http-exception"

app.post("/batches/account/:accountId", async context => {
	const service = context.get("service")
	const transactions = await context.req.json()
	const id = context.req.param("accountId")
	const accountId = Number(id)
	if (!id && !Number.isNaN(accountId)) {
		throw new HTTPException(401, { message: "Missing accountId" })
	}
	return context.json(await service.transaction.createBatch({ accountId, transactions }))
})
