type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug'

type LogMethod = (message: string, ...args: unknown[]) => void

export type Logger = Record<LogLevel, LogMethod>

const dateTimeFormatter = new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
})

const formatTimestamp = () => dateTimeFormatter.format(new Date())

const formatMessage = (service: string, level: LogLevel, message: string) =>
    `[${formatTimestamp()}]-[${service}]-[${level.toUpperCase()}] ${message}`

const buildMethod =
    (service: string, level: LogLevel): LogMethod =>
    (message, ...args) => {
        const consoleMethod = level === 'log' ? 'log' : level
        console[consoleMethod](formatMessage(service, level, message), ...args)
    }

export const createLogger = (serviceName: string): Logger => {
    return {
        log: buildMethod(serviceName, 'log'),
        info: buildMethod(serviceName, 'info'),
        warn: buildMethod(serviceName, 'warn'),
        error: buildMethod(serviceName, 'error'),
        debug: buildMethod(serviceName, 'debug'),
    }
}
