import { useEffect, useMemo, useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import { SegmentedTabButton } from '@/components/SegmentedTabButton'
import { OverviewTab } from '@/pages/company/components/OverviewTab'
import { EmployeesTab } from '@/pages/company/components/EmployeesTab'
import { getCompanyById, getCompanyEmployees } from '@/pages/company/api/company-api'
import { ensureHttp, getInitials } from '@/lib/utils'

const EMPLOYEE_PAGE_SIZE = 10
type TabKey = 'overview' | 'employees'

const TABS: Array<{ id: TabKey; label: string; description: string }> = [
    { id: 'overview', label: 'Overview', description: 'Company context and key facts' },
    { id: 'employees', label: 'Employees', description: 'People who have worked here' },
]

export function CompanyDetailsPage() {
    const { companyId } = useParams({ from: '/company/$companyId' })
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
                        <SegmentedTabButton
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

export default CompanyDetailsPage
