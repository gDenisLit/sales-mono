import type { ReactElement } from 'react'
import type { ICompany } from '@shared/models/company.model'
import { ensureHttp } from '@/lib/utils'
import { FactCard } from '@/components/FactCard'

type OverviewTabProps = {
    company: ICompany
}

export function OverviewTab({ company }: OverviewTabProps) {
    const headcount = company.numOfEmployees?.toLocaleString() ?? company.sizeRange ?? 'Unknown'
    const location = [company.city, company.region, company.country].filter(Boolean).join(', ') || 'Unknown'
    const onlinePresence = [
        company.website ? (
            <a key="website" className="font-semibold text-blue-300" href={ensureHttp(company.website)} target="_blank" rel="noreferrer">
                Visit website
            </a>
        ) : null,
        company.profileUrl ? (
            <a key="linkedin" className="font-semibold text-blue-300" href={company.profileUrl} target="_blank" rel="noreferrer">
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
                <FactCard label="Industry" value={company.industry ?? 'Unknown'} />
                <FactCard label="Company type" value={company.companyType ?? 'Unknown'} />
                <FactCard label="Headcount" value={headcount} />
                <FactCard label="Headquarters" value={location} />
                <FactCard label="Year founded" value={company.yearFounded ? String(company.yearFounded) : 'Unknown'} />
                <FactCard label="Region" value={company.region ?? company.country ?? 'Unknown'} />
                <FactCard
                    label="Public identifier"
                    value={company.publicIdentifier ?? company.prevPublicIdentifiers?.[0] ?? 'Unknown'}
                />
                <FactCard label="Primary domain" value={company.domain ?? 'Unknown'} />
                <FactCard label="Source" value={company.source ?? 'Private dataset'} />
                <FactCard
                    label="Data last updated"
                    value={company.updatedAt ? new Date(company.updatedAt).toLocaleDateString() : 'Unknown'}
                />
                {company.domains && company.domains.length > 0 && <FactCard label="Domains" value={company.domains.join(', ')} />}
                {company.funding?.rounds && company.funding.rounds.length > 0 && (
                    <FactCard
                        label="Funding rounds"
                        value={`${company.funding.rounds.length} round${company.funding.rounds.length === 1 ? '' : 's'}`}
                    />
                )}
            </dl>
        </div>
    )
}

