export type PersonExperience = {
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

export type Person = {
  _id: string
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
  experiences?: PersonExperience[]
  skills?: string[]
  emails?: string[]
}

export type PaginatedPeopleResponse = {
  total: number
  size: number
  results: Person[]
}


