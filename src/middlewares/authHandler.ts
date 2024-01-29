import * as express from 'express';
import { ApiError } from '../configs';
import { JWTHandler } from '../helpers';

export function expressAuthentication(
    request: express.Request,
    securityName: string,
    scopes?: string[]
): Promise<any> {
    if (securityName === "jwt") {
        return new Promise((resolve, reject) => {
            let token = request.headers.authorization;
            if (!token) {
                return reject(new ApiError(401, 'Token not provided'));
            }
            let userDecodedData = new JWTHandler().verify(token);
            if (!userDecodedData) {
                return reject(new ApiError(401, 'Invalid token'));
            }
            return resolve(userDecodedData);
        });
    }
    return Promise.reject(new ApiError(401, 'Invalid security details'));
}