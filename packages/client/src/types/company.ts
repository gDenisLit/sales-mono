type FundingData = {
    rounds?: Record<string, unknown>[]
    investors?: Record<string, unknown>[]
}

export type Company = {
    _id: string
    name: string
    industry?: string
    city?: string
    country?: string
    countryCode?: string
    region?: string
    zip?: string
    description?: string
    image?: string
    website?: string
    profileUrl?: string
    crunchbaseUrl?: string
    numOfEmployees?: number
    sizeRange?: string
    source?: string
    companyType?: string
    yearFounded?: number
    domain?: string
    domains?: string[]
    funding?: FundingData
    companyId?: number
    publicIdentifier?: string
    prevPublicIdentifiers?: string[]
    scrapedAt?: string
    updatedAt?: string
}

export type PaginatedCompaniesResponse = {
    total: number
    size: number
    results: Company[]
}
