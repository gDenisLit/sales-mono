import { useEffect, useMemo, useState, type ReactElement, type ReactNode } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { keepPreviousData, useQuery, type UseQueryResult } from '@tanstack/react-query'
import { getCompanyById } from '../../lib/company-api'
import { getCompanyEmployees } from '../../lib/person-api'
import type { Company } from '../../types/company'
import type { PaginatedPeopleResponse, Person } from '../../types/person'

export const Route = createFileRoute('/company/$companyId')({
    component: CompanyDetailPage,
})

const EMPLOYEE_PAGE_SIZE = 10
type TabKey = 'overview' | 'employees'

const TABS: Array<{ id: TabKey; label: string; description: string }> = [
    { id: 'overview', label: 'Overview', description: 'Company context and key facts' },
    { id: 'employees', label: 'Employees', description: 'People who have worked here' },
]

function CompanyDetailPage() {
    const { companyId } = Route.useParams()
    const [activeTab, setActiveTab] = useState<TabKey>('overview')
    const [employeePage, setEmployeePage] = useState(1)

    useEffect(() => {
        setEmployeePage(1)
    }, [companyId])

    const {
        data: company,
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: ['company-detail', companyId],
        queryFn: () => getCompanyById(companyId),
    })

    const employeeQuery = useQuery({
        queryKey: ['company-employees', companyId, employeePage],
        queryFn: () =>
            getCompanyEmployees({
                companyId,
                skip: (employeePage - 1) * EMPLOYEE_PAGE_SIZE,
                limit: EMPLOYEE_PAGE_SIZE,
            }),
        enabled: activeTab === 'employees',
        placeholderData: keepPreviousData,
    })

    const companyLocation = useMemo(() => {
        if (!company) return ''
        return [company.city, company.region, company.country].filter(Boolean).join(' • ')
    }, [company])

    if (isLoading) {
        return (
            <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-10 text-center text-slate-300">
                Loading company profile…
            </div>
        )
    }

    if (isError || !company) {
        return (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-6 py-8 text-red-100">
                <p className="text-lg font-semibold">We couldn’t load that company.</p>
                <p className="mt-2 text-sm text-red-200/80">
                    {error instanceof Error ? error.message : 'Unknown error.'}
                </p>
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

    return (
        <section className="space-y-6 rounded-2xl border border-white/10 bg-white/5 px-6 py-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/20 text-2xl font-bold text-blue-100">
                    {getInitials(company.name)}
                </div>
                <div className="flex flex-1 flex-col gap-1">
                    <h2 className="text-3xl font-semibold text-white">{company.name}</h2>
                    <p className="text-sm text-slate-400">{companyLocation || 'Location coming soon'}</p>
                    <div className="flex flex-wrap gap-3 text-sm text-blue-300">
                        {company.website && (
                            <a
                                href={ensureHttp(company.website)}
                                target="_blank"
                                rel="noreferrer"
                                className="font-semibold"
                            >
                                Website
                            </a>
                        )}
                        {company.profileUrl && (
                            <a href={company.profileUrl} target="_blank" rel="noreferrer" className="font-semibold">
                                LinkedIn
                            </a>
                        )}
                        {company.crunchbaseUrl && (
                            <a href={company.crunchbaseUrl} target="_blank" rel="noreferrer" className="font-semibold">
                                Crunchbase
                            </a>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <div className="flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-slate-900/60 p-1">
                    {TABS.map((tab) => (
                        <TabButton
                            key={tab.id}
                            label={tab.label}
                            description={tab.description}
                            isActive={activeTab === tab.id}
                            onSelect={() => setActiveTab(tab.id)}
                        />
                    ))}
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4 sm:p-6">
                    {activeTab === 'overview' && <OverviewTab company={company} />}
                    {activeTab === 'employees' && (
                        <EmployeesTab
                            company={company}
                            page={employeePage}
                            pageSize={EMPLOYEE_PAGE_SIZE}
                            onPageChange={setEmployeePage}
                            query={employeeQuery}
                        />
                    )}
                </div>
            </div>
        </section>
    )
}

function OverviewTab({ company }: { company: Company }) {
    const headcount = company.numOfEmployees?.toLocaleString() ?? company.sizeRange ?? 'Unknown'
    const location = [company.city, company.region, company.country].filter(Boolean).join(', ') || 'Unknown'
    const onlinePresence = [
        company.website ? (
            <a
                key="website"
                className="font-semibold text-blue-300"
                href={ensureHttp(company.website)}
                target="_blank"
                rel="noreferrer"
            >
                Visit website
            </a>
        ) : null,
        company.profileUrl ? (
            <a
                key="linkedin"
                className="font-semibold text-blue-300"
                href={company.profileUrl}
                target="_blank"
                rel="noreferrer"
            >
                View LinkedIn
            </a>
        ) : null,
        company.crunchbaseUrl ? (
            <a
                key="crunchbase"
                className="font-semibold text-blue-300"
                href={company.crunchbaseUrl}
                target="_blank"
                rel="noreferrer"
            >
                Crunchbase profile
            </a>
        ) : null,
    ].filter((link): link is ReactElement => Boolean(link))

    return (
        <div className="space-y-6">
            <section className="space-y-3">
                <p className="text-xs uppercase tracking-wide text-blue-300">Overview</p>
                <p className="text-base text-slate-200">{company.description ?? 'No overview available yet.'}</p>
                {onlinePresence.length > 0 && <div className="flex flex-wrap gap-4 text-sm">{onlinePresence}</div>}
            </section>

            <dl className="grid gap-4 sm:grid-cols-2">
                <Fact label="Industry" value={company.industry ?? 'Unknown'} />
                <Fact label="Company type" value={company.companyType ?? 'Unknown'} />
                <Fact label="Headcount" value={headcount} />
                <Fact label="Headquarters" value={location} />
                <Fact label="Year founded" value={company.yearFounded ? String(company.yearFounded) : 'Unknown'} />
                <Fact label="Region" value={company.region ?? company.country ?? 'Unknown'} />
                <Fact
                    label="Public identifier"
                    value={company.publicIdentifier ?? company.prevPublicIdentifiers?.[0] ?? 'Unknown'}
                />
                <Fact label="Primary domain" value={company.domain ?? 'Unknown'} />
                <Fact label="Source" value={company.source ?? 'Private dataset'} />
                <Fact
                    label="Data last updated"
                    value={company.updatedAt ? new Date(company.updatedAt).toLocaleDateString() : 'Unknown'}
                />
                {company.domains && company.domains.length > 0 && (
                    <Fact label="Domains" value={company.domains.join(', ')} />
                )}
                {company.funding?.rounds && company.funding.rounds.length > 0 && (
                    <Fact
                        label="Funding rounds"
                        value={`${company.funding.rounds.length} round${company.funding.rounds.length === 1 ? '' : 's'}`}
                    />
                )}
            </dl>
        </div>
    )
}

type EmployeesTabProps = {
    company: Company
    page: number
    pageSize: number
    onPageChange: (page: number) => void
    query: UseQueryResult<PaginatedPeopleResponse, Error>
}

function EmployeesTab({ company, page, pageSize, onPageChange, query }: EmployeesTabProps) {
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
                        <EmployeeCard key={person._id} person={person} companyPublicId={companyPublicId} />
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

type TabButtonProps = {
    label: string
    description: string
    isActive: boolean
    onSelect: () => void
}

function TabButton({ label, description, isActive, onSelect }: TabButtonProps) {
    return (
        <button
            type="button"
            onClick={onSelect}
            className={`flex flex-1 flex-col rounded-xl px-4 py-3 text-left transition ${
                isActive ? 'bg-white text-slate-900' : 'bg-transparent text-slate-200 hover:bg-white/5'
            }`}
        >
            <span className="text-sm font-semibold">{label}</span>
            <span className={`text-xs ${isActive ? 'text-slate-600' : 'text-slate-400'}`}>{description}</span>
        </button>
    )
}

function EmployeeCard({ person, companyPublicId }: { person: Person; companyPublicId?: string }) {
    const name = [person.firstName, person.lastName].filter(Boolean).join(' ') || 'Team member'
    const location = [person.city, person.country].filter(Boolean).join(', ')
    const role = findMatchingExperience(person, companyPublicId)

    const roleTitle = role?.title ?? person.occupation ?? person.headline ?? 'Role unavailable'
    const tenure = formatTenure(role?.starts_at, role?.ends_at)
    const skills = (person.skills ?? []).slice(0, 4)

    return (
        <article className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/20 text-lg font-semibold text-blue-100">
                    {person.profilePicUrl ? (
                        <img src={person.profilePicUrl} alt={name} className="h-full w-full rounded-2xl object-cover" />
                    ) : (
                        getInitials(name)
                    )}
                </div>
                <div className="flex flex-col">
                    <p className="text-lg font-semibold text-white">{name}</p>
                    <p className="text-sm text-slate-300">{roleTitle}</p>
                    {location && <p className="text-xs text-slate-400">{location}</p>}
                </div>
            </div>
            <div className="flex flex-1 flex-col gap-2 text-sm text-slate-200">
                {role?.description && <p className="text-slate-300">{role.description}</p>}
                <p className="text-xs uppercase tracking-wide text-slate-400">{tenure}</p>
                {skills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {skills.map((skill) => (
                            <span
                                key={skill}
                                className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-200"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                )}
                <div className="flex flex-wrap gap-3 text-xs text-blue-300">
                    {person.profileUrl && (
                        <a href={person.profileUrl} target="_blank" rel="noreferrer" className="font-semibold">
                            View profile
                        </a>
                    )}
                    {person.emails?.[0] && <span className="text-slate-300">{person.emails[0]}</span>}
                </div>
            </div>
        </article>
    )
}

function Fact({ label, value }: { label: string; value: ReactNode }) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <dt className="text-xs uppercase tracking-wide text-slate-400">{label}</dt>
            <dd className="mt-2 text-base text-white">{value}</dd>
        </div>
    )
}

function getInitials(value?: string) {
    if (!value) return '?'
    return value
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((chunk) => chunk.charAt(0).toUpperCase())
        .join('')
}

function ensureHttp(url: string) {
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url
    }
    return `https://${url}`
}

function findMatchingExperience(person: Person, companyPublicId?: string) {
    if (!person.experiences?.length) {
        return undefined
    }
    if (companyPublicId) {
        const match = person.experiences.find((experience) => experience.company_public_id === companyPublicId)
        if (match) {
            return match
        }
    }
    return person.experiences[0]
}

function formatTenure(startsAt?: string, endsAt?: string) {
    const formattedStart = formatDate(startsAt)
    const formattedEnd = formatDate(endsAt) ?? 'Present'
    if (!formattedStart && !formattedEnd) {
        return 'Tenure unknown'
    }
    if (!formattedStart) {
        return `Ended ${formattedEnd}`
    }
    return `${formattedStart} – ${formattedEnd}`
}

function formatDate(value?: string) {
    if (!value) return undefined
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) {
        return undefined
    }
    return date.toLocaleString('en-US', { month: 'short', year: 'numeric' })
}
