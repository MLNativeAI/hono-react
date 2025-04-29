import { Hono } from 'hono'

const router = new Hono()

router.get('/', (c) => c.json({ message: 'Hello World' }))

router.post('/', (c) => c.json({ message: 'Hello World' }))

export default router
