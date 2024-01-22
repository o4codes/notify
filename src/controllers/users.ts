import { Body, Controller, Get, Post, Route, Query, Response } from "tsoa";
import { UserService } from "../services/user";
import { PaginatedUserResponseType, UserCreateType, UserResponseType } from "../schemas/user";
import { ApiResponse, ResponseStatus } from "../schemas/commons";


@Route("users")
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

    @Response<ApiResponse>('default', "Error Occured")
    @Post()
    public async createUser(
        @Body() body: UserCreateType
    ): Promise<ApiResponse<UserResponseType>> {
        const userCreated =  await new UserService().create(body);
        const response = {
            status: ResponseStatus.SUCCESS,
            message: "User created successfully",
            data: userCreated
        }
        return response
    }
}