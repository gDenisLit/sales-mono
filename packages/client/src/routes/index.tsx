import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { searchCompanies } from '../lib/company-api'
import { useDebouncedValue } from '../hooks/use-debounce'
import type { Company } from '../types/company'

const MIN_SEARCH_LENGTH = 2
const PREVIEW_LIMIT = 5

export const Route = createFileRoute('/')({
    component: SearchLanding,
})

function SearchLanding() {
    const navigate = useNavigate()
    const [searchTerm, setSearchTerm] = useState('')
    const [isFocused, setIsFocused] = useState(false)

    const debouncedTerm = useDebouncedValue(searchTerm.trim(), 300)

    const {
        data: previewResults,
        isFetching,
        isError,
    } = useQuery({
        queryKey: ['company-search-preview', debouncedTerm],
        queryFn: () =>
            searchCompanies({
                name: debouncedTerm,
                skip: 0,
                limit: PREVIEW_LIMIT,
            }),
        enabled: debouncedTerm.length >= MIN_SEARCH_LENGTH,
    })

    const suggestions = previewResults?.results ?? []

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const term = searchTerm.trim()
        if (!term) return

        navigate({
            to: '/company/list',
            search: {
                name: term,
                page: 1,
            },
        })
    }

    const handleCompanySelect = (company: Company) => {
        navigate({
            to: '/company/$companyId',
            params: { companyId: company._id },
        })
    }

    const shouldShowDropdown = isFocused && searchTerm.trim().length >= MIN_SEARCH_LENGTH && !isError

    return (
        <div className="relative rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-blue-900/20 backdrop-blur">
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <label className="text-sm font-medium text-slate-300">Company name</label>
                <div className="flex flex-col gap-2 sm:flex-row">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setTimeout(() => setIsFocused(false), 150)}
                            placeholder="e.g. Figma, OpenAI, Deel"
                            className="h-12 w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 text-base text-white placeholder:text-slate-500 focus:border-blue-400 focus:outline-none"
                        />
                        {isFetching && (
                            <span className="absolute inset-y-0 right-3 flex items-center text-sm text-slate-400">
                                Searching...
                            </span>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="h-12 rounded-xl bg-blue-500 px-4 text-base font-semibold text-white transition hover:bg-blue-400"
                    >
                        Search
                    </button>
                </div>
                <p className="text-sm text-slate-400">
                    Enter a company name to see instant previews. Press Enter to view the full results list.
                </p>
            </form>

            {shouldShowDropdown && (
                <div className="absolute inset-x-0 top-full z-10 mt-2 rounded-2xl border border-white/10 bg-slate-900/95 p-2 shadow-2xl">
                    {isFetching && (
                        <div className="rounded-xl bg-slate-800/90 px-4 py-3 text-sm text-slate-400">
                            Loading previews...
                        </div>
                    )}
                    {!isFetching && suggestions.length === 0 && (
                        <div className="rounded-xl bg-slate-800/90 px-4 py-3 text-sm text-slate-400">
                            No matches yet. Keep typing or press Enter to search all results.
                        </div>
                    )}
                    {suggestions.map((company) => (
                        <button
                            key={company._id}
                            type="button"
                            onClick={() => handleCompanySelect(company)}
                            className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left transition hover:bg-white/5"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20 text-lg font-semibold text-blue-200">
                                {company.name?.charAt(0) ?? '?'}
                            </div>
                            <div className="flex flex-1 flex-col">
                                <span className="font-medium text-white">{company.name}</span>
                                <span className="text-sm text-slate-400">
                                    {[company.industry, company.city, company.country].filter(Boolean).join(' • ')}
                                </span>
                            </div>
                            <span className="text-sm font-semibold text-blue-300">View org chart</span>
                        </button>
                    ))}
                </div>
            )}

            {isError && (
                <div className="mt-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    Something went wrong while searching. Try again shortly.
                </div>
            )}
        </div>
    )
}
