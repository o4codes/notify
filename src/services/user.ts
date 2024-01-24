import { Repository } from "typeorm";
import { ApiError, MainDataSource } from "../configs";
import { UserEntity, UserSecurityKeysEntity } from "../models";
import { userCreateSchema, userResponseSchema, userUpdateSchema, UserResponseType} from "../schemas/user";
import { CryptoHandler } from "../helpers";

export default class UserService {
    private userRepository: Repository<UserEntity>;
    private userKeysRepository: Repository<UserSecurityKeysEntity>;

    constructor() {
        this.userRepository = MainDataSource.getRepository(UserEntity);
        this.userKeysRepository = MainDataSource.getRepository(UserSecurityKeysEntity);
    }

    async create(user_data: Object): Promise<UserResponseType> {
        const validatedResult = await userCreateSchema.safeParseAsync(user_data);
        if (!validatedResult.success) {
            throw new ApiError(400, validatedResult.error.message, validatedResult.error.format());
        }
        let user = new UserEntity();
        user.name = validatedResult.data.name;
        user.email = validatedResult.data.email;
        user.password = await CryptoHandler.hashPassword(validatedResult.data.password);
        await this.userRepository.save(user);
        return userResponseSchema.parse(user); 
    }

    async list(filter: Object, limit: number = 20, offset: number = 0) {
        const users = await this.userRepository.find({
            where: filter,
            take: limit,
            skip: offset
        });
        const parsedUsers = userResponseSchema.array().parse(users);
        return parsedUsers
    }

    async get(id: string){
        const user = await this.userRepository.findOneBy({ id });
        if (!user) throw new ApiError(404, 'User not found');
        return userResponseSchema.parse(user);
    }

    async update(id: string, data: Object): Promise<UserResponseType>{
        const user = await this.userRepository.findOneBy({ id });
        if (!user) throw new ApiError(404, 'User not found');

        const validatedResult = await userUpdateSchema.safeParseAsync(data);
        if (!validatedResult.success) {
            throw new ApiError(400, validatedResult.error.message, validatedResult.error.format());
        }
        user.name = validatedResult.data?.name || user.name;
        user.email = validatedResult.data?.email || user.email;
        if (validatedResult.data?.password) {
            user.password = await CryptoHandler.hashPassword(validatedResult.data.password);
        }
        await this.userRepository.save(user);
        return userResponseSchema.parse(user);
    }

    async delete(id: string): Promise<void> {
        this.get(id)
        await this.userRepository.delete({ id });
    }

    async getByEmail(email: string): Promise<UserResponseType>{
        const user = await this.userRepository.findOneBy({ email });
        if (!user) throw new ApiError(404, 'User not found');
        return userResponseSchema.parse(user);
    }

    async renewSecurityKeys(id: string){
    }

    async getSecurityKeys(id: string){
    }
}