import { cn } from '@/lib/utils'

type SegmentedTabButtonProps = {
    label: string
    description?: string
    isActive: boolean
    onSelect: () => void
}

export function SegmentedTabButton({ label, description, isActive, onSelect }: SegmentedTabButtonProps) {
    return (
        <button
            type="button"
            onClick={onSelect}
            className={cn(
                'flex flex-1 flex-col rounded-xl px-4 py-3 text-left transition',
                isActive ? 'bg-white text-slate-900' : 'bg-transparent text-slate-200 hover:bg-white/5'
            )}
        >
            <span className="text-sm font-semibold">{label}</span>
            {description ? (
                <span className={cn('text-xs', isActive ? 'text-slate-600' : 'text-slate-400')}>{description}</span>
            ) : null}
        </button>
    )
}

