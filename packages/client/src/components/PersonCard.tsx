import type { IPerson } from '@shared/models/person.model'
import { getInitials } from '@/lib/utils'

type PersonCardProps = {
    person: IPerson
    companyPublicId?: string
}

export function PersonCard({ person, companyPublicId }: PersonCardProps) {
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
                            <span key={skill} className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-200">
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

function findMatchingExperience(person: IPerson, companyPublicId?: string) {
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

