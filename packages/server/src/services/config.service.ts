function get<T>(key: string): T {
    const value = Bun.env[key]
    return value as T
}

function getOrThrow<T>(key: string): T {
    const value = Bun.env[key]
    if (!value) {
        throw new Error(`Environment variable ${key} is not set`)
    }
    return value as T
}

export const configService = {
    get,
    getOrThrow,
}
