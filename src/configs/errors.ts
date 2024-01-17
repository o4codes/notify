export default class ApiError extends Error {
    private status: number;
    private data?: object;

    constructor(status: number, message: string, data?: object) {
        super(message);
        this.status = status;
        this.data = data;
    }
}