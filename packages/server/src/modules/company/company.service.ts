import { CompanyModel, type Company } from './company.schema'
import { ConfigService } from '../../services/config.service'
import type { ObjectId } from '../../types/mongo.types'
import type { PaginationInputType, PaginatoinResultsType } from '@shared/types/pagination.types'

export const CompanyService = {
    createCompany,
    findCompanyById,
    findCompanyByPublicIdentifier,
    findCompanyByDomain,
    searchCompaniesByNamePaginated,
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

export async function searchCompaniesByNamePaginated(
    name: string,
    { skip, limit }: PaginationInputType,
): Promise<PaginatoinResultsType<Company>> {
    const index = ConfigService.getOrThrow<string>('ATLAS_COMPANY_SEARCH_INDEX')

    const searchStage = {
        $search: {
            index,
            autocomplete: {
                query: name,
                path: 'name',
                fuzzy: {
                    maxEdits: 1,
                },
            },
        },
    }

    const searchMetaStage = {
        $searchMeta: {
            index,
            autocomplete: {
                query: name,
                path: 'name',
                fuzzy: {
                    maxEdits: 1,
                    maxExpansions: 50,
                },
            },
            count: { type: 'total' },
        },
    }

    const [results, meta] = await Promise.all([
        CompanyModel.aggregate([searchStage, { $skip: skip }, { $limit: limit }]),
        CompanyModel.aggregate([searchMetaStage]),
    ])

    return {
        total: meta[0]?.count?.total ?? 0,
        size: limit,
        results,
    }
}
