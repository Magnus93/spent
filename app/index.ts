import { Context as HonoContext, Hono } from "hono"
import { Repository } from "Repository"
import { Service } from "Service"

export interface Env {
	Bindings: Environment
	Variables: Env.Variables
}

export namespace Env {
	export interface Variables {
		repository: Repository
		service: Service
	}
}

export const app = new Hono<Env>().use("*", async (c, next) => {
	const repository = new Repository(c.env.hyperdrive)
	c.set("repository", repository)

	const service = new Service(repository, "local")
	c.set("service", service)

	await next()
})
export namespace app {
	export type Context = HonoContext<Env>
}
