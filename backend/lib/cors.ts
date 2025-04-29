import { cors } from "hono/cors";
import type { MiddlewareHandler } from "hono";

// Cors middleware that only applies in development mode
export const corsMiddleware: MiddlewareHandler = cors({
    origin: "http://localhost:5173",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
})