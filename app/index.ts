import { Context as HonoContext, Hono } from "hono"
import { Env } from "./Env"

export const app = new Hono<Env>()
export namespace app {
    export type Context = HonoContext<Env>
}