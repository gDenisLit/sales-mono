import { Hono } from 'hono'
import { dbService } from './services/db.service'
import { ApiController } from './api.controller'

await dbService.connectMongoDb()

const app = new Hono()

app.get('/health', (c) => c.json({ message: 'Healty' }, 200))

app.route('/', ApiController)

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
