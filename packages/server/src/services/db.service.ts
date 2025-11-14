import * as mongoose from 'mongoose'
import { ConfigService } from './config.service'

async function connectMongoDb() {
    const mongoUri = ConfigService.getOrThrow<string>('MONGO_URI')
    const dbName = ConfigService.getOrThrow<string>('MONGO_DB_NAME')

    try {
        await mongoose.connect(mongoUri, { dbName })
        console.log(`Connected to MongoDB: ${dbName}`)
    } catch (err) {
        console.error('Error connecting to MongoDB', err)
        throw err
    }
}

async function disconnectMongoDb() {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
}

export const dbService = {
    connectMongoDb,
    disconnectMongoDb,
}
