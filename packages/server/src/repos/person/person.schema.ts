import * as mongoose from 'mongoose'

const personSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        age: { type: Number, required: true },
        email: { type: String, required: true },
    },
    {
        collection: 'person',
        timestamps: true,
        strictQuery: 'throw',
        strict: 'throw',
    },
)

export type Person = mongoose.InferSchemaType<typeof personSchema>
export const PersonModel = mongoose.model<Person>('Person', personSchema)
