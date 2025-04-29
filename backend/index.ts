import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import todos from './routes/todos'


const app = new Hono()
app.get('/api/health', (c) => c.text('OK'))

app.route('/api/todos', todos)

app.use('/*', serveStatic({ root: '../frontend/dist' }))
app.get('*', serveStatic({ path: '../frontend/dist/index.html' }))



export default app