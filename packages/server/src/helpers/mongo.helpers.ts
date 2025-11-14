import mongoose from 'mongoose'
import type { ObjectId } from '../types/mongo.types'

export function toObjectId(id: string): ObjectId {
    return new mongoose.Types.ObjectId(id)
}
