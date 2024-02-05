import { userMessageConfigSchema } from "../schemas"; 

export type UserMessageConfigType = ReturnType<typeof userMessageConfigSchema.parse>;
