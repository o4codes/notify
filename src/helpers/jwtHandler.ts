import jwt from "jsonwebtoken";


export default class JWTHandler {
    private _secret: string;
    private _jwtTtl: number;

    constructor() {
        this._secret = process.env.JWT_SECRET || "secret";
        this._jwtTtl = 60 * 60 * 24;
    }

    public sign(payload: Object): string {
        return jwt.sign(payload, this._secret, { expiresIn: this._jwtTtl });
    }
    
    public verify(token: string): Object {
        return jwt.verify(token, this._secret);
    }

}