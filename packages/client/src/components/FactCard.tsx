import type { ReactNode } from 'react'

type FactCardProps = {
    label: string
    value: ReactNode
}

export function FactCard({ label, value }: FactCardProps) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <dt className="text-xs uppercase tracking-wide text-slate-400">{label}</dt>
            <dd className="mt-2 text-base text-white">{value}</dd>
        </div>
    )
}

