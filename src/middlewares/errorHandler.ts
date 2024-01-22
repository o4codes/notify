import express, {
    Response as ExResponse,
    Request as ExRequest,
    NextFunction,
} from "express";
import { ApiError, logger } from "../configs";
import { ResponseStatus } from "../schemas/commons";
import { ValidateError } from "tsoa";
// ...

export function errorHandler(
    err: unknown,
    req: ExRequest,
    res: ExResponse,
    next: NextFunction
): ExResponse | void {
    if (err instanceof ValidateError) {
        logger.error(`Caught Validation Error for ${req.path}:`, err.fields);
        return res.status(422).json({
            status: ResponseStatus.FAILURE,
            message: "Validation Failed",
            data: err?.fields,
        });
    }
    if (err instanceof ApiError) {
        logger.error("Caught ApiError", err);
        return res.status(err.status).json({
            status: ResponseStatus.FAILURE,
            message: err.message,
            data: err?.data,
        });
    }
    if (err instanceof Error) {
        logger.error("Caught Server Error", err);
        return res.status(500).json({
            status: ResponseStatus.FAILURE,
            message: "Internal Server Error",
            data: null
        });
    }

    next();
}

export function notFoundHandler(req: ExRequest, res: ExResponse) {
    res.status(404).send({
        status: ResponseStatus.FAILURE,
        message: "Route Not Found",
        data: null
    })
}