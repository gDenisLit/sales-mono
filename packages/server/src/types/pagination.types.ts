export type PaginationInputType = {
    skip: number
    limit: number
}

export type PaginatoinResultsType<T> {
    total: number
    size: number
    results: T[]
}