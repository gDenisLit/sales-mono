import { createFileRoute } from '@tanstack/react-router'
import { CompanyListPage } from '@/pages/company/CompanyListPage'

export const Route = createFileRoute('/company/list')({
    validateSearch: (search: Record<string, unknown>) => {
        const name = typeof search.name === 'string' ? search.name : ''
        const rawPage = Number(search.page ?? 1)
        const page = Number.isNaN(rawPage) || rawPage < 1 ? 1 : rawPage

        return {
            name,
            page,
        }
    },
    component: CompanyListPage,
})
