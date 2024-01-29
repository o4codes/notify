import { Repository } from "typeorm";
import { ApiError, MainDataSource } from "../configs";
import { UserEntity } from "../models";
import { userResponseSchema, authLoginRequestSchema, userCreateSchema, authResetPasswordSchema } from "../schemas";
import { MailRecipients, MailBody } from "../helpers/emailSender";
import { CryptoHandler, JWTHandler, cache, EmailSender } from "../helpers";
import { AuthLoginResponseType, UserCreateType } from "../types";
import UserService from "./user";


export default class AuthService {
    private _userRepository: Repository<UserEntity>;
    private _signupOtpPrefix: string = "signup-otp-";
    private _resetPasswordOtpPrefix: string = "reset-password-otp-";

    constructor() {
        this._userRepository = MainDataSource.getRepository(UserEntity);
    }

    async login(email: string, password: string): Promise<AuthLoginResponseType> {
        const validatedResult = authLoginRequestSchema.safeParse({ email, password });
        if (!validatedResult.success) {
            throw new ApiError(400, validatedResult.error.message, validatedResult.error.format());
        }
        const user = await this._userRepository.findOneBy({ email });
        if (!user) throw new ApiError(404, 'User not found');
        const isPasswordValid = await CryptoHandler.comparePassword(password, user.password);
        if (!isPasswordValid) throw new ApiError(401, 'Invalid password');
        const userParsed = userResponseSchema.parse(user);
        const token = new JWTHandler().sign(userParsed);
        return { user: userParsed, token };
    }

    async signUp(userData: UserCreateType){
        const validatedResult = await userCreateSchema.safeParseAsync(userData);
        if (!validatedResult.success) {
            throw new ApiError(400, "Invalid user data", validatedResult.error.format());
        }
        const userValidatedData = validatedResult.data;
        const otpCode: string = await this._generateOTPCode();
        await cache.save(`${this._signupOtpPrefix}${otpCode}`, JSON.stringify(userValidatedData));
        await this._sendVerifyEmail(userValidatedData.email, otpCode);
        return
    }

    async verifyUserAccount(email: string, otpCode: string) {
        const cachedData = await cache.get(`${this._signupOtpPrefix}${otpCode}`);
        if (!cachedData) throw new ApiError(400, 'Invalid OTP code');
        const userData: UserCreateType = JSON.parse(cachedData);
        if (userData.email !== email) throw new ApiError(400, 'Invalid OTP code');

        const user = await new UserService().create(userData);
        await cache.delete(otpCode);
        await this._sendVerifySuccessEmail(email);
        return user
    }

    async initiatePasswordReset(email: string) {
        const user = await this._userRepository.findOneBy({ email });
        if (!user) throw new ApiError(404, `User with email ${email} not found`);
        const otpCode: string = await this._generateOTPCode();
        await cache.save(`${this._resetPasswordOtpPrefix}${otpCode}`, user.email);
        await this._sendInitiatePasswordResetEmail(email, otpCode);
        return
    }

    async resetPassword(email: string, otpCode: string, password: string) {
        const validatedResult = authResetPasswordSchema.safeParse({ email, otpCode, password });
        if (!validatedResult.success) {
            throw new ApiError(400, validatedResult.error.message, validatedResult.error.format());
        }
        const cachedData = await cache.get(`${this._resetPasswordOtpPrefix}${otpCode}`);
        if (!cachedData) throw new ApiError(400, 'Invalid OTP code');
        if (cachedData !== email) throw new ApiError(400, 'Invalid OTP code');
        const user = await this._userRepository.findOneBy({ email });
        if (!user) throw new ApiError(404, `User with email ${email} not found`);
        user.password = await CryptoHandler.hashPassword(password);
        await this._userRepository.save(user);
        await cache.delete(otpCode);
        await this._sendPasswordResetSuccessEmail(email);
        return
    }

    private async _sendVerifyEmail(recipientEmail: string, otpCode: string) {
        const receipients: MailRecipients = {
            to: [recipientEmail,]
        }
        const messageBody: MailBody = {
            text: `Your OTP code is ${otpCode}`
        }
        const subject = "Verify Email Address"
        await new EmailSender(receipients, subject, messageBody).send();
    }

    private async _sendVerifySuccessEmail(recipientEmail: string) {
        const recipients: MailRecipients = {
            to: [recipientEmail]
        }
        const messageBody: MailBody = {
            text: "Your account has been verified successfully"
        }
        const subject = "Email Verification Success"
        await new EmailSender(recipients, subject, messageBody).send();
    }

    private async  _sendInitiatePasswordResetEmail(recipientEmail: string, otpCode: string) {
        const recipients: MailRecipients = {
            to: [recipientEmail]
        }
        const messageBody: MailBody = {
            text: `Password reset OTP code is ${otpCode}`
        }
        const subject = "Password Reset"
        await new EmailSender(recipients, subject, messageBody).send();
    }

    private async _sendPasswordResetSuccessEmail(recipientEmail: string) {
        const recipients: MailRecipients = {
            to: [recipientEmail]
        }
        const messageBody: MailBody = {
            text: "Your password has been reset successfully"
        }
        const subject = "Password Reset Success"
        await new EmailSender(recipients, subject, messageBody).send();
    }

    private async _generateOTPCode(length: number = 4){
        const digits = '0123456789';
        let otp = '';
        for (let i = 0; i < length; i++) {
            otp += digits[Math.floor(Math.random() * 10)];
        }
        return otp
    }
}