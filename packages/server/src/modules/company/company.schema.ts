import * as mongoose from 'mongoose'
import type { SchemaBaseFields } from '../../types/mongo.types'
import type { ICompany } from '@shared/models/company.model'

const companySchema = new mongoose.Schema<SchemaBaseFields<ICompany>>(
    {
        profileUrl: { type: String, required: true },
        city: { type: String },
        countryCode: { type: String },
        description: { type: String },
        downloadedUrl: { type: String },
        image: { type: String },
        industry: { type: String },
        name: { type: String, required: true },
        numOfEmployees: { type: Number },
        region: { type: String },
        sizeRange: { type: String },
        source: { type: String },
        website: { type: String },
        zip: { type: String },
        companyId: { type: Number },
        publicIdentifier: { type: String },
        country: { type: String },
        crunchbaseUrl: { type: String },
        companyType: { type: String },
        yearFounded: { type: Number },
        domain: { type: String },
        prevPublicIdentifiers: { type: [String] },
        domains: { type: [String] },
        funding: {
            rounds: { type: [Object] },
            investors: { type: [Object] },
        },
        scrapedAt: { type: Date },
    },
    {
        collection: 'company',
        timestamps: true,
        strictQuery: 'throw',
        strict: 'throw',
    },
)

companySchema.virtual('id').get(function () {
    return this._id.toString()
})
companySchema.set('toJSON', { virtuals: true })
companySchema.set('toObject', { virtuals: true })

export type Company = mongoose.InferSchemaType<typeof companySchema>
export const CompanyModel = mongoose.model<Company>('Company', companySchema)
