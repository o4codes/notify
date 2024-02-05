import { userCreateSchema, userResponseSchema, ApiPaginatedResponse, userUpdateSchema, userSecurityKeysSchema } from "../schemas";

export type UserCreateType = ReturnType<typeof userCreateSchema.parse>;
export type UserUpdateType = ReturnType<typeof userUpdateSchema.parse>;
export type UserResponseType = ReturnType<typeof userResponseSchema.parse>;
export type PaginatedUserResponseType = ApiPaginatedResponse<Array<UserResponseType>>;

export type UserSecurityKeysType = ReturnType<typeof userSecurityKeysSchema.parse>;
