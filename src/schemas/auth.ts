import { z } from "zod"
import { userResponseSchema } from "./user";

export const authLoginRequestSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z
        .string()
        .min(6, 'Password must be at least 6 characters long')
        .regex(/^[a-zA-Z0-9]+$/, 'Password must be alphanumeric'),
});


export const authLoginResponseSchema = z.object({
    token: z.string(),
    user: userResponseSchema
});


export const authVerifySchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    otpCode: z.string()
});
