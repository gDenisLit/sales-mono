import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function getInitials(value?: string) {
    if (!value) return '?'
    return value
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((chunk) => chunk.charAt(0).toUpperCase())
        .join('')
}

export function ensureHttp(url: string) {
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url
    }
    return `https://${url}`
}
