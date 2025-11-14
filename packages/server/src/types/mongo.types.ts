import type mongoose from 'mongoose'

export type ObjectId = mongoose.Types.ObjectId

export type SchemaBaseFields<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>
