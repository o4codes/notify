import { Body, Controller, Post, Route, Response, Tags, Res } from "tsoa";
import { ApiResponse, ResponseStatus } from "../schemas";
import { AuthService } from "../services";
import { AuthLoginRequestType, AuthLoginResponseType, AuthResetPasswordType, AuthVerifyType, UserCreateType, UserResponseType } from "../types";


@Route("auth")
@Tags("Auth")
export class AuthController extends Controller {

    // @Post("/login")
    // public async login(
    //     @Body() body: AuthLoginRequestType
    // ): Promise<ApiResponse<AuthLoginResponseType>> {
    //     const user = await new AuthService().login(body.email, body.password);
    //     const response = {
    //         status: ResponseStatus.SUCCESS,
    //         message: "User logged in successfully",
    //         data: user
    //     }
    //     return response
    // }

    @Response<ApiResponse>('default', "Error Occured")
    @Post("/signup")
    public async createUser(
        @Body() body: UserCreateType
    ): Promise<ApiResponse> {
        await new AuthService().signUp(body);
        const response = {
            status: ResponseStatus.SUCCESS,
            message: "Email Verification sent successfully",
            data: null
        }
        return response
    }

    @Response<ApiResponse>('default', "Error Occured")
    @Response<ApiResponse<UserResponseType>>(201, "User created successfully")
    @Post("/verify")
    public async resendVerification(
        @Body() body: AuthVerifyType
    ): Promise<ApiResponse<UserResponseType>> {
        const userCreated =  await new AuthService().verifyUserAccount(body.email, body.otpCode)
        const response = {
            status: ResponseStatus.SUCCESS,
            message: "Account verified successfully",
            data: userCreated
        }
        return response
    }

    @Response<ApiResponse>('default', "Error Occured")
    @Post("/password/reset")
    public async initiatePasswordReset(
        @Body() body: {email: string}
    ): Promise<ApiResponse> {
        await new AuthService().initiatePasswordReset(body.email)
        const response = {
            status: ResponseStatus.SUCCESS,
            message: "Password reset email sent successfully",
            data: null
        }
        return response
    }

    @Response<ApiResponse>('default', "Error Occured")
    @Post("/password/reset/verify")
    public async verifyPasswordReset(
        @Body() body: AuthResetPasswordType
    ): Promise<ApiResponse> {
        await new AuthService().resetPassword(body.email, body.otpCode, body.password)
        const response = {
            status: ResponseStatus.SUCCESS,
            message: "Password reset successful",
            data: null
        }
        return response
    }

}