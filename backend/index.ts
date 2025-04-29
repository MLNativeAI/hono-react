import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import files from './routes/files'
import { auth, authHandler, requireAuth } from './lib/auth'
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
// Cors middleware for local development
app.use("*", corsMiddleware);
// Require authentication for all routes
app.use("*", requireAuth);
// BetterAuth handler
app.on(["POST", "GET"], "/api/auth/*", authHandler);

// Health check
app.get('/api/health', async (c) => {
    return c.json({
        status: 'ok'
    })
})

export const apiRoutes = app.basePath('/api').route('/files', files)

// Serve static files
app.use('/*', serveStatic({ root: '../frontend/dist' }))
app.get('*', serveStatic({ path: '../frontend/dist/index.html' }))

export default app
export type ApiRoutes = typeof apiRoutes