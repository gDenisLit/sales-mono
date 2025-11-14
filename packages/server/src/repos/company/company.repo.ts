import type { ObjectId } from '../../types/mongo.types'
import { CompanyModel, type Company } from './company.schema'

export const CompanyRepo = {
    createCompany,
    findCompanyById,
    findCompanyByPublicIdentifier,
    findCompanyByDomain,
}

export function createCompany(company: Company): Promise<Company> {
    return CompanyModel.create(company)
}

export function findCompanyById(id: ObjectId): Promise<Company | null> {
    return CompanyModel.findById(id).lean()
}

export function findCompanyByPublicIdentifier(publicIdentifier: string): Promise<Company | null> {
    return CompanyModel.findOne({ publicIdentifier }).lean()
}

export function findCompanyByDomain(domain: string): Promise<Company | null> {
    return CompanyModel.findOne({ domain }).lean()
}
