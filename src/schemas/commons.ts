export enum ResponseStatus {
    SUCCESS = 'success',
    FAILURE = 'failure'
}

export interface ApiResponse<T=undefined> {
    status: ResponseStatus,
    message: string
    data?: T
}

export interface ApiPaginatedResponse<T> extends ApiResponse<T> {
    size: number
    page: number
}