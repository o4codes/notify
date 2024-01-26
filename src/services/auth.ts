import { Repository } from "typeorm";
import { ApiError, MainDataSource } from "../configs";
import { UserEntity } from "../models";
import { userResponseSchema, AuthLoginResponseType, authLoginRequestSchema, UserCreateType, userCreateSchema } from "../schemas";
import { MailRecipients, MailBody } from "../helpers/emailSender";
import { CryptoHandler, JWTHandler, cache, EmailSender } from "../helpers";
import UserService from "./user";


export default class AuthService {
    private userRepository: Repository<UserEntity>;

    constructor() {
        this.userRepository = MainDataSource.getRepository(UserEntity);
    }

    async login(email: string, password: string): Promise<AuthLoginResponseType> {
        const validatedResult = authLoginRequestSchema.safeParse({ email, password });
        if (!validatedResult.success) {
            throw new ApiError(400, validatedResult.error.message, validatedResult.error.format());
        }
        const user = await this.userRepository.findOneBy({ email });
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
        await cache.save(otpCode, JSON.stringify(userValidatedData));
        await this._sendVerifyEmail(userValidatedData.email, otpCode);
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

    async verifyUserAccount(email: string, otpCode: string) {
        const cachedData = await cache.get(otpCode);
        if (!cachedData) throw new ApiError(400, 'Invalid OTP code');
        const userData: UserCreateType = JSON.parse(cachedData);
        if (userData.email !== email) throw new ApiError(400, 'Invalid OTP code');

        const user = await new UserService().create(userData);
        await cache.delete(otpCode);
        await this._sendVerifySuccessEmail(email);
        return user
    }

    private async _sendVerifySuccessEmail(recipientEmail: string) {
        const recipients: MailRecipients = {
            to: [recipientEmail]
        }
        const messageBody: MailBody = {
            text: "Your account has been verified successfully"
        }
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