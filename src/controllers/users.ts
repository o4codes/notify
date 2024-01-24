import { Controller, Get, Route, Query } from "tsoa";
import { UserService } from "../services";
import { PaginatedUserResponseType, ResponseStatus } from "../schemas";


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

}