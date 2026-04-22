import { app } from "app"

app.get("/transactions", async context => {
	const service = context.get("service")
	const accountId = context.req.queries("accountId")?.map(a => Number(a))
	const batchId = context.req.queries("batchId")?.map(a => Number(a))
	const dateAfter = context.req.query("dateAfter")
	const dateBefore = context.req.query("dateBefore")
	const minAmount = context.req.query("minAmount") ? Number(context.req.query("minAmount")) : undefined
	const maxAmount = context.req.query("maxAmount") ? Number(context.req.query("maxAmount")) : undefined
	const limit = context.req.query("limit") ? Number(context.req.query("limit")) : undefined
	const continuation = context.req.query("continuation")

	return context.json(
		await service.transaction.list(
			{
				accountId,
				batchId,
				date: { after: dateAfter, before: dateBefore },
				amount: { min: minAmount, max: maxAmount },
			},
			limit,
			continuation
		)
	)
})
