import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import files from './routes/files'
import { auth } from './auth'
import { cors } from "hono/cors";
import { logger } from 'hono/logger'
import { db } from './db';
import { user } from './db/schema';


const app = new Hono<{
    Variables: {
        user: typeof auth.$Infer.Session.user | null;
        session: typeof auth.$Infer.Session.session | null
    }
}>();

app.use(logger())


app.use("*", async (c, next) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });

    if (!session) {
        c.set("user", null);
        c.set("session", null);
        return next();
    }

    c.set("user", session.user);
    c.set("session", session.session);
    return next();
});

app.use(
    "*", // or replace with "*" to enable cors for all routes
    cors({
        origin: "http://localhost:5173", // replace with your origin
        allowHeaders: ["Content-Type", "Authorization"],
        allowMethods: ["POST", "GET", "OPTIONS"],
        exposeHeaders: ["Content-Length"],
        maxAge: 600,
        credentials: true,
    }),
);

app.on(["POST", "GET"], "/api/auth/*", (c) => {
    return auth.handler(c.req.raw);
});

app.get("/api/auth/me", (c) => {
    return c.json({
        user: c.get("user"),
        session: c.get("session")
    });
});

app.get('/api/health', async (c) => {
    try {
        const users = await db.select().from(user);
        return c.json({
            status: 'ok',
            users: users
        });
    } catch (error) {
        return c.json({
            status: 'error',
            message: 'Database connection failed'
        });
    }
})

app.route('/api/files', files)




app.use('/*', serveStatic({ root: '../frontend/dist' }))
app.get('*', serveStatic({ path: '../frontend/dist/index.html' }))


export default app