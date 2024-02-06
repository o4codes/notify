import { z } from "zod"


export const userSchema = z.object({
    id: z.string().uuid({ message: "Invalid UUID" }),
    name: z.string(),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
        .string()
        .min(6, 'Password must be at least 6 characters long')
        .regex(/^[a-zA-Z0-9]+$/, 'Password must be alphanumeric'),
    createdDateTime: z.date(),
    updatedDateTime: z.date().nullish(),
});


export const userCreateSchema = userSchema.omit({ id: true, createdDateTime: true, updatedDateTime: true });
export const userUpdateSchema = userCreateSchema.optional();
export const userResponseSchema = userSchema.omit({ password: true });


export const userSecurityKeysSchema = z.object({
    publicKey: z.string(),
    secretKey: z.string(),
    createdDateTime: z.date(),
    updatedDateTime: z.date().nullish(),
});


export const userMessageConfigSchema = z.object({
    sourceEmailAddress: z.string().email({ message: "Invalid email address" }),
    sourceMobileNumber: z.string().regex(/^[0-9]+$/, 'Invalid mobile number'),
    fcmToken: z.string(),
    createdDateTime: z.date(),
    updatedDateTime: z.date().nullish(),
}).optional();