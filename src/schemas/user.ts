import { z } from "zod"


export const userSchema = z.object({
    id: z.string().uuid({ message: "Invalid UUID" }),
    name: z.string(),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
        .string()
        .min(6, 'Password must be at least 6 characters long')
        .regex(/^[a-zA-Z0-9]+$/, 'Password must be alphanumeric'),
    isVerified: z.boolean().default(false),
    createdDateTime: z.date(),
    updatedDateTime: z.date().nullish(),
});

export const userCreateSchema = userSchema.omit({ id: true, isVerified: true, createdDateTime: true, updatedDateTime: true });
export const userUpdateSchema = userCreateSchema.optional();
export const userResponseSchema = userSchema.omit({ password: true });

export type UserCreateType = ReturnType<typeof userCreateSchema.parse>;
export type UserUpdateType = ReturnType<typeof userUpdateSchema.parse>;
export type UserResponseType = ReturnType<typeof userResponseSchema.parse>;