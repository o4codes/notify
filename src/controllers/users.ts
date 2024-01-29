import { Controller, Get, Patch, Delete, Body, Route, Query, Path, Tags, Security, Request } from "tsoa";
import { UserService } from "../services";
import { ApiResponse, ResponseStatus } from "../schemas";
import { PaginatedUserResponseType, UserResponseType, UserUpdateType } from "../types";
import { ApiError } from "../configs";


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

    @Security("jwt")
    @Get("/{userId}")
    public async getUser(
        @Path() userId: string,
        @Request() request: any
    ): Promise<ApiResponse<UserResponseType>> {
        if (request.user.id != userId) throw new ApiError(401, 'Inadequate permission to access this resource');
        const user = await new UserService().get(userId);
        return {
            status: ResponseStatus.SUCCESS,
            message: "User retrieved successfully",
            data: user
        }
    }

    @Security("jwt")
    @Patch("/{userId}")
    public async updateUser(
        @Path() userId: string,
        @Body() body: UserUpdateType,
        @Request() request: any
    ): Promise<ApiResponse<UserResponseType>> {
        if (request.user.id != userId) throw new ApiError(401, 'Inadequate permission to update this resource');
        const user = await new UserService().update(userId, body);
        return {
            status: ResponseStatus.SUCCESS,
            message: "User updated successfully",
            data: user
        }
    }

    @Security("jwt")
    @Delete("/{userId}")
    public async deleteUser(
        @Path() userId: string,
        @Request() request: any
    ): Promise<ApiResponse> {
        if (request.user.id != userId) throw new ApiError(401, 'Inadequate permission to delete this resource');
        await new UserService().delete(userId);
        return {
            status: ResponseStatus.SUCCESS,
            message: "User deleted successfully",
            data: null
        }
    }

}