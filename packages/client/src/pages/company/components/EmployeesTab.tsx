import type { UseQueryResult } from '@tanstack/react-query'
import type { ICompany } from '@shared/models/company.model'
import type { IPerson } from '@shared/models/person.model'
import type { PaginatoinResultsType } from '@shared/types/pagination.types'
import { PersonCard } from '@/components/PersonCard'

type EmployeesTabProps = {
    company: ICompany
    page: number
    pageSize: number
    onPageChange: (page: number) => void
    query: UseQueryResult<PaginatoinResultsType<IPerson>, Error>
}

export function EmployeesTab({ company, page, pageSize, onPageChange, query }: EmployeesTabProps) {
    const { data, isLoading, isFetching, isError, error, refetch } = query
    const results = data?.results ?? []
    const total = data?.total ?? 0
    const totalPages = total > 0 ? Math.ceil(total / pageSize) : 1
    const companyPublicId = company.publicIdentifier ?? company.prevPublicIdentifiers?.[0]

    if (isLoading && !data) {
        return <div className="flex min-h-[200px] items-center justify-center text-slate-300">Loading employees…</div>
    }

    if (isError) {
        return (
            <div className="space-y-4 rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-red-100">
                <div>
                    <p className="text-base font-semibold">Unable to load employees</p>
                    <p className="text-sm opacity-80">{error instanceof Error ? error.message : 'Unknown error'}</p>
                </div>
                <button
                    type="button"
                    onClick={() => refetch()}
                    className="rounded-xl bg-red-500/80 px-4 py-2 text-sm font-semibold text-white"
                >
                    Try again
                </button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <p className="text-sm text-slate-300">
                    Showing{' '}
                    {results.length > 0 ? `${(page - 1) * pageSize + 1}–${(page - 1) * pageSize + results.length}` : 0}{' '}
                    of {total.toLocaleString()} people
                </p>
                {isFetching && <p className="text-xs text-slate-400">Updating…</p>}
            </div>

            {results.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-10 text-center text-slate-300">
                    No employees matched this company yet. Check back soon.
                </div>
            ) : (
                <div className="space-y-4">
                    {results.map((person) => (
                        <PersonCard key={person.id} person={person} companyPublicId={companyPublicId} />
                    ))}
                </div>
            )}

            {totalPages > 1 && (
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white">
                    <button
                        type="button"
                        disabled={page === 1}
                        onClick={() => onPageChange(Math.max(1, page - 1))}
                        className="rounded-xl px-3 py-2 font-semibold text-blue-300 disabled:opacity-40"
                    >
                        Previous
                    </button>
                    <p className="text-slate-300">
                        Page {page} of {totalPages}
                    </p>
                    <button
                        type="button"
                        disabled={page >= totalPages}
                        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                        className="rounded-xl px-3 py-2 font-semibold text-blue-300 disabled:opacity-40"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    )
}
