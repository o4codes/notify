import { Repository } from "typeorm";
import { ApiError, MainDataSource } from "../configs";
import { UserEntity } from "../models";
import { userResponseSchema, AuthLoginResponseType, authLoginRequestSchema } from "../schemas";
import { CryptoHandler, JWTHandler } from "../helpers";


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
        if (!user.isVerified) throw new ApiError(401, 'User not verified');
        const isPasswordValid = await CryptoHandler.comparePassword(password, user.password);
        if (!isPasswordValid) throw new ApiError(401, 'Invalid password');
        
        const userParsed = userResponseSchema.parse(user);
        const token = new JWTHandler().sign(userParsed);
        return { user: userParsed, token };
    }
}