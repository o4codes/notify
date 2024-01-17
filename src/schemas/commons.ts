interface ApiResponse<T> {
    status: 'success' | 'error',
    message: string
    data?: T
}

interface ApiPaginatedResponse<T> extends ApiResponse<T> {
    size: number
    page: number
}