import { app } from "app"
import { HTTPException } from "hono/http-exception"

app.post("/batches/swedbank/:accountId", async context => {
	const service = context.get("service")
	const id = context.req.param("accountId")
	const accountId = Number(id)
	if (!id && !Number.isNaN(accountId)) {
		throw new HTTPException(401, { message: "Missing accountId" })
	}
	const csv = await context.req.text()
	return context.json(await service.transaction.createBatch("swedbank", accountId, csv))
})
