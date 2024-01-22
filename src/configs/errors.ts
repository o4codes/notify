export default class ApiError extends Error {
    private _status: number;
    private _data?: object;

    constructor(status: number, message: string, data?: object) {
        super(message);
        this._status = status;
        this._data = data;
    }

    public get status(): number {
        return this._status;
    }

    public get data(): object | undefined {
        return this._data;
    }
}