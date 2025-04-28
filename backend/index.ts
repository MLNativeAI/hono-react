import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'


const app = new Hono()
app.get('/api/hello', (c) => c.text('Hello Bun!'))

app.use('/*', serveStatic({ root: '../frontend/dist' }))
app.get('*', serveStatic({ path: '../frontend/dist/index.html' }))

export default app