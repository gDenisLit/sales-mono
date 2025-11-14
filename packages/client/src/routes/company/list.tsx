import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { searchCompanies } from '../../lib/company-api'
import type { Company } from '../../types/company'

const PAGE_SIZE = 20

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

function CompanyListPage() {
  const navigate = useNavigate()
  const { name, page } = Route.useSearch()
  const hasQuery = name.trim().length > 0

  const { data, isFetching, isError, error, refetch } = useQuery({
    queryKey: ['company-search-list', name, page],
    queryFn: () =>
      searchCompanies({
        name,
        skip: (page - 1) * PAGE_SIZE,
        limit: PAGE_SIZE,
      }),
    enabled: hasQuery,
  })

  const goToPage = (nextPage: number) => {
    navigate({
      to: '/company/list',
      search: {
        name,
        page: nextPage,
      },
    })
  }

  if (!hasQuery) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-10 text-center text-slate-300">
        Enter a company name on the homepage to start exploring organization charts.
      </div>
    )
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-6 py-8 text-red-100">
        <p className="text-lg font-semibold">Unable to load companies</p>
        <p className="mt-2 text-sm text-red-200/80">{error instanceof Error ? error.message : 'Unknown error'}</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-4 rounded-xl bg-red-500/80 px-4 py-2 text-sm font-semibold text-white"
        >
          Try again
        </button>
      </div>
    )
  }

  const results = data?.results ?? []
  const total = data?.total ?? results.length
  const totalPages = total > 0 ? Math.ceil(total / PAGE_SIZE) : 1

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-2">
        <p className="text-sm uppercase tracking-wide text-blue-300">
          Results for “{name}”
        </p>
        <h2 className="text-2xl font-semibold text-white">
          {isFetching ? 'Loading companies…' : `${total} matching compan${total === 1 ? 'y' : 'ies'}`}
        </h2>
        <p className="text-sm text-slate-400">
          Select a company to jump into its org chart preview.
        </p>
      </header>

      <div className="space-y-3">
        {results.map((company) => (
          <CompanyListItem key={company._id} company={company} />
        ))}
        {!isFetching && results.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-10 text-center text-slate-400">
            No companies matched “{name}”. Try refining your search query.
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => goToPage(page - 1)}
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
            onClick={() => goToPage(page + 1)}
            className="rounded-xl px-3 py-2 font-semibold text-blue-300 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </section>
  )
}

function CompanyListItem({ company }: { company: Company }) {
  const navigate = useNavigate()

  const handleSelect = () => {
    navigate({
      to: '/company/$companyId',
      params: { companyId: company._id },
    })
  }

  return (
    <button
      type="button"
      onClick={handleSelect}
      className="flex w-full flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-left text-white transition hover:border-blue-400/60 hover:bg-blue-500/10 sm:flex-row sm:items-center"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20 text-lg font-semibold text-blue-100">
        {company.name?.charAt(0) ?? '?'}
      </div>
      <div className="flex flex-1 flex-col">
        <span className="text-lg font-semibold">{company.name}</span>
        <span className="text-sm text-slate-400">
          {[company.industry, company.city, company.country].filter(Boolean).join(' • ') || 'Details coming soon'}
        </span>
      </div>
      <span className="text-sm font-semibold text-blue-300">View org chart</span>
    </button>
  )
}

