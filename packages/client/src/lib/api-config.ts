const API_ORIGIN =
  (import.meta.env.VITE_SERVER_URL as string | undefined)?.replace(/\/$/, '') ?? 'http://localhost:3000'

export const COMPANY_API_BASE = `${API_ORIGIN}/api/company`
export const PERSON_API_BASE = `${API_ORIGIN}/api/person`


