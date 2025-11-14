import { createFileRoute } from '@tanstack/react-router'
import { CompanyDetailsPage } from '@/pages/company/CompanyDetailsPage'

export const Route = createFileRoute('/company/$companyId')({
    component: CompanyDetailsPage,
})
