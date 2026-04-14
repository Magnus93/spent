import { Context as HonoContext, Hono } from "hono"
import { Repository } from "Repository"
import { Service } from "Service"

export interface Env {
	Bindings: Environment
	Variables: Env.Variables
}

export namespace Env {
	export interface Variables {
		service: Service
	}
}

export const app = new Hono<Env>().use("*", async (c, next) => {
	c.set("service", new Service(new Repository(), "local"))
	await next()
})
export namespace app {
	export type Context = HonoContext<Env>
}
