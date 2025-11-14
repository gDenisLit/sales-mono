export interface IPerson {
    id: string
    firstName?: string
    lastName?: string
    headline?: string
    occupation?: string
    city?: string
    country?: string
    countryCode?: string
    summary?: string
    profilePicUrl?: string
    profileUrl?: string
    publicIdentifier?: string
    experiences?: IExperience[]
    skills?: string[]
    emails?: string[]
    languages?: string[]
    certifications?: string[]
    experienceFromSafeSource?: boolean
    source?: string
    state?: string
    publicIds?: string[]
    linkedinId?: number
    linkedinUrn?: string
    baseScrapedAt?: Date
    scrapedAt?: Date
    connections?: number
    education?: IEducation[]
    createdAt?: Date
    updatedAt?: Date
}

export interface IExperience {
    starts_at?: string
    ends_at?: string
    company?: string
    company_profile_url?: string
    company_public_id?: string
    company_id?: number
    title?: string
    description?: string
    location?: string
    logo_url?: string
    website?: string
}

export interface IEducation {
    school?: string
    school_public_id?: string
    school_short_id?: string
    degree_name?: string
    field_of_study?: string
    school_profile_url?: string
    logo_url?: string
}
