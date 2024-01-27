import { Controller, Get, Patch, Delete, Body, Route, Query, Path, Tags } from "tsoa";
import { UserService } from "../services";
import { ApiResponse, ResponseStatus } from "../schemas";
import { PaginatedUserResponseType, UserResponseType, UserUpdateType } from "../types";


@Route("users")
@Tags("User")
export class UserController extends Controller {

    @Get()
    public async getUsers(
        @Query() limit: number = 20,
        @Query() offset: number = 0
    ): Promise<PaginatedUserResponseType> {
        const users = await new UserService().list({}, limit, offset);
        return {
            size: users.length,
            page: 1,
            status: ResponseStatus.SUCCESS,
            message: "Users retrieved successfully",
            data: users
        }
    }

    @Get("/{userId}")
    public async getUser(
        @Path() userId: string
    ): Promise<ApiResponse<UserResponseType>> {
        const user = await new UserService().get(userId);
        return {
            status: ResponseStatus.SUCCESS,
            message: "User retrieved successfully",
            data: user
        }
    }

    @Patch("/{userId}")
    public async updateUser(
        @Path() userId: string,
        @Body() body: UserUpdateType
    ): Promise<ApiResponse<UserResponseType>> {
        const user = await new UserService().update(userId, body);
        return {
            status: ResponseStatus.SUCCESS,
            message: "User updated successfully",
            data: user
        }
    }

    @Delete("/{userId}")
    public async deleteUser(
        @Path() userId: string
    ): Promise<ApiResponse> {
        await new UserService().delete(userId);
        return {
            status: ResponseStatus.SUCCESS,
            message: "User deleted successfully",
            data: null
        }
    }

}