import { app } from "app"

app.get("/health", context => {
	return context.json({ status: "ok" })
})
