import { Hono } from 'hono'
import { z } from 'zod'
import { s3 } from '@/lib/s3'
import { db } from '@/db'
import { file } from '@/db/schema'

const uploadFileSchema = z.object({
    file: z.instanceof(File),
    name: z.string(),
})

const fileListSchema = z.array(z.object({
    id: z.string(),
    filename: z.string(),
    path: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    presignedUrl: z.string(),
}))

type FileList = z.infer<typeof fileListSchema>

const app = new Hono()

const router = app
    .get('/', async (c) => {
        const files = await db.select().from(file)
        const filesWithPresignedUrl: FileList = await Promise.all(files.map(async (file) => {
            const presignedUrl = await s3.presign(file.path)
            return {
                ...file,
                presignedUrl
            }
        }))
        return c.json(filesWithPresignedUrl)
    })
    .post('/', async (c) => {
        try {
            const body = await c.req.formData()
            const fileParam = body.get('file') as File
            const nameParam = body.get('name') as string

            if (!fileParam || !nameParam) {
                return c.json({ error: 'File and name are required' }, 400)
            }

            const validatedData = uploadFileSchema.parse({
                file: fileParam,
                name: nameParam
            })

            const id = crypto.randomUUID()

            await db.insert(file).values({
                id,
                filename: validatedData.name,
                path: validatedData.file.name,
                createdAt: new Date(),
                updatedAt: new Date(),
            })

            const fileBuffer = await fileParam.arrayBuffer()

            await s3.file(`files/${id}`).write(fileBuffer)

            return c.json({
                message: 'File uploaded successfully',
                id
            }, 201)
        } catch (error) {
            console.error('Upload error:', error)
            if (error instanceof z.ZodError) {
                return c.json({ error: 'Invalid file data' }, 400)
            }
            return c.json({ error: 'Internal server error' }, 500)
        }
    })

export default router

export type FileRouteType = typeof router
