import { authLoginRequestSchema, authLoginResponseSchema, authVerifySchema } from "../schemas";

export type AuthLoginRequestType = ReturnType<typeof authLoginRequestSchema.parse>;
export type AuthLoginResponseType = ReturnType<typeof authLoginResponseSchema.parse>;
export type AuthVerifyType = ReturnType<typeof authVerifySchema.parse>;