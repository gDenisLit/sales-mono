import type { ICompany } from '@shared/models/company.model'
import type { IPerson } from '@shared/models/person.model'
import type { PaginationInputType, PaginatoinResultsType } from '@shared/types/pagination.types'
import { COMPANY_API_BASE, PERSON_API_BASE } from '@/lib/api-config'

type SearchParams = PaginationInputType & {
    name: string
}

type CompanyEmployeeParams = PaginationInputType & {
    companyId: string
}

export async function searchCompanies({ name, skip, limit }: SearchParams): Promise<PaginatoinResultsType<ICompany>> {
    const searchParams = new URLSearchParams({
        name,
        skip: String(skip),
        limit: String(limit),
    })

    const response = await fetch(`${COMPANY_API_BASE}/list/search?${searchParams.toString()}`)
    if (!response.ok) {
        throw new Error('Unable to search companies')
    }

    return response.json()
}

export async function getCompanyById(id: string): Promise<ICompany> {
    const response = await fetch(`${COMPANY_API_BASE}/${id}`)

    if (!response.ok) {
        throw new Error('Unable to load company')
    }

    return response.json()
}

export async function getCompanyEmployees({
    companyId,
    skip,
    limit,
}: CompanyEmployeeParams): Promise<PaginatoinResultsType<IPerson>> {
    const searchParams = new URLSearchParams({
        skip: String(skip),
        limit: String(limit),
    })

    const response = await fetch(`${PERSON_API_BASE}/company/${companyId}/employees?${searchParams.toString()}`)

    if (!response.ok) {
        throw new Error('Unable to load employees')
    }

    return response.json()
}
