import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import files from './routes/files'
import { auth, requireAuth } from './lib/auth'
import { corsMiddleware } from './lib/cors'
import { logger } from 'hono/logger'
import { poweredBy } from 'hono/powered-by'

const app = new Hono<{
    Variables: {
        user: typeof auth.$Infer.Session.user | null;
        session: typeof auth.$Infer.Session.session | null
    }
}>();

app.use(poweredBy())

app.use(logger())

app.use("*", corsMiddleware);

// Apply authentication middleware
app.use("*", requireAuth);



app.on(["POST", "GET"], "/api/auth/*", (c) => {
    return auth.handler(c.req.raw);
});

app.get('/api/health', async (c) => {
    return c.json({
        status: 'ok'
    })
})

app.route('/api/files', files)

app.use('/*', serveStatic({ root: '../frontend/dist' }))
app.get('*', serveStatic({ path: '../frontend/dist/index.html' }))

export default app