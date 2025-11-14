import type { ICompany } from '@shared/models/company.model'

type CompanyListItemProps = {
    company: ICompany
    onSelect: (companyId: string) => void
}

export function CompanyListItem({ company, onSelect }: CompanyListItemProps) {
    const details = [company.industry, company.city, company.country].filter(Boolean).join(' • ') || 'Details coming soon'

    return (
        <button
            type="button"
            onClick={() => onSelect(company.id)}
            className="flex w-full flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-left text-white transition hover:border-blue-400/60 hover:bg-blue-500/10 sm:flex-row sm:items-center"
        >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20 text-lg font-semibold text-blue-100">
                {company.name?.charAt(0) ?? '?'}
            </div>
            <div className="flex flex-1 flex-col">
                <span className="text-lg font-semibold">{company.name}</span>
                <span className="text-sm text-slate-400">{details}</span>
            </div>
            <span className="text-sm font-semibold text-blue-300">View org chart</span>
        </button>
    )
}

