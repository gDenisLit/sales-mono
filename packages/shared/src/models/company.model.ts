export interface ICompany {
    id: string
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
    funding?: {
        rounds?: Record<string, unknown>[]
        investors?: Record<string, unknown>[]
    }
    companyId?: number
    publicIdentifier?: string
    prevPublicIdentifiers?: string[]
    scrapedAt?: Date
    updatedAt?: Date
    createdAt?: Date
    downloadedUrl?: string
}
