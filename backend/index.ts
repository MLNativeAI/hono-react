import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import files from './routes/files'
import { auth } from './auth'


const app = new Hono<{
    Variables: {
        user: typeof auth.$Infer.Session.user | null;
        session: typeof auth.$Infer.Session.session | null
    }
}>();

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

app.on(["POST", "GET"], "/api/auth/**", (c) => {
    return auth.handler(c.req.raw);
});

app.get("/api/auth/me", (c) => {
    return c.json({
        user: c.get("user"),
        session: c.get("session")
    });
});

app.get('/api/health', (c) => c.text('OK'))

app.route('/api/files', files)




app.use('/*', serveStatic({ root: '../frontend/dist' }))
app.get('*', serveStatic({ path: '../frontend/dist/index.html' }))


export default app