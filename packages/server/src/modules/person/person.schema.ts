import * as mongoose from 'mongoose'
import type { SchemaBaseFields } from '../../types/mongo.types'
import type { IEducation, IExperience, IPerson } from '@shared/models/person.model'

const educationSchema = new mongoose.Schema<SchemaBaseFields<IEducation>>(
    {
        school: String,
        school_public_id: String,
        school_short_id: String,
        degree_name: String,
        field_of_study: String,
        school_profile_url: String,
        logo_url: String,
    },
    { _id: false },
)

const experienceSchema = new mongoose.Schema<SchemaBaseFields<IExperience>>(
    {
        starts_at: Date,
        ends_at: Date,
        company: String,
        company_profile_url: String,
        company_public_id: String,
        company_id: Number,
        title: String,
        description: String,
        location: String,
        logo_url: String,
        website: String,
    },
    { _id: false },
)

const personSchema = new mongoose.Schema<SchemaBaseFields<IPerson>>(
    {
        city: String,
        connections: Number,

        education: {
            type: [educationSchema],
            default: [],
        },

        experiences: {
            type: [experienceSchema],
            default: [],
        },

        headline: String,
        languages: {
            type: [String],
            default: [],
        },

        occupation: String,
        source: String,
        summary: String,

        baseScrapedAt: Date,
        scrapedAt: Date,

        country: String,
        countryCode: String,

        certifications: {
            type: [String],
            default: [],
        },

        experienceFromSafeSource: Boolean,

        skills: {
            type: [String],
            default: [],
        },

        state: String,

        publicIds: {
            type: [String],
            default: [],
        },

        emails: {
            type: [String],
            default: [],
        },

        firstName: String,
        lastName: String,
        profilePicUrl: String,

        publicIdentifier: String,
        profileUrl: String,

        linkedinId: Number,
        linkedinUrn: String,
    },
    {
        collection: 'person',
        timestamps: true,
        strictQuery: 'throw',
        strict: 'throw',
    },
)

personSchema.virtual('id').get(function () {
    return this._id.toString()
})
personSchema.set('toJSON', { virtuals: true })
personSchema.set('toObject', { virtuals: true })

export type Person = mongoose.InferSchemaType<typeof personSchema>
export const PersonModel = mongoose.model<Person>('Person', personSchema)
