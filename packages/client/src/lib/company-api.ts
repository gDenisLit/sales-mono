import { COMPANY_API_BASE } from './api-config'
import type { PaginatedCompaniesResponse, Company } from '../types/company'

type SearchParams = {
    name: string
    skip: number
    limit: number
}

export async function searchCompanies({ name, skip, limit }: SearchParams): Promise<PaginatedCompaniesResponse> {
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

export async function getCompanyById(id: string): Promise<Company> {
    const response = await fetch(`${COMPANY_API_BASE}/${id}`)

    if (!response.ok) {
        throw new Error('Unable to load company')
    }

    return response.json()
}
