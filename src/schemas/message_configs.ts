import { z } from "zod";

export const userMessageConfigSchema = z.object({
    sourceEmailAddress: z.string().email({ message: "Invalid email address" }),
    sourceMobileNumber: z.string().regex(/^[0-9]+$/, 'Invalid mobile number'),
    fcmToken: z.string(),
    createdDateTime: z.date(),
    updatedDateTime: z.date().nullish(),
}).optional();