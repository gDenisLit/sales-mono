import { PERSON_API_BASE } from './api-config'
import type { PaginatedPeopleResponse } from '../types/person'

type CompanyEmployeeParams = {
  companyId: string
  skip: number
  limit: number
}

export async function getCompanyEmployees({
  companyId,
  skip,
  limit,
}: CompanyEmployeeParams): Promise<PaginatedPeopleResponse> {
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


