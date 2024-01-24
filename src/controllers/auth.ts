import { Body, Controller, Post, Route, Response, Tags } from "tsoa";
import { ApiResponse, ResponseStatus, AuthLoginRequestType, AuthLoginResponseType, UserCreateType, UserResponseType } from "../schemas";
import { AuthService, UserService } from "../services";


@Route("auth")
@Tags("Auth")
export class AuthController extends Controller {

    @Post("/login")
    public async login(
        @Body() body: AuthLoginRequestType
    ): Promise<ApiResponse<AuthLoginResponseType>> {
        const user = await new AuthService().login(body.email, body.password);
        const response = {
            status: ResponseStatus.SUCCESS,
            message: "User logged in successfully",
            data: user
        }
        return response
    }

    @Response<ApiResponse>('default', "Error Occured")
    @Post("/signup")
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