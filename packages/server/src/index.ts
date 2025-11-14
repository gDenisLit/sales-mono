import { Hono } from 'hono'
import { dbService } from './services/db.service'

await dbService.connectMongoDb()

const app = new Hono()

app.get('/', (c) => c.json({ message: 'Hello World' }))

const server = Bun.serve({
    port: 3000,
    fetch: app.fetch,
})

console.log(`Listening on ${server.url}`)

process.on('SIGINT', async () => {
    await dbService.disconnectMongoDb()
    process.exit(0)
})

process.on('SIGTERM', async () => {
    await dbService.disconnectMongoDb()
    process.exit(0)
})

process.on('SIGQUIT', async () => {
    await dbService.disconnectMongoDb()
    process.exit(0)
})
