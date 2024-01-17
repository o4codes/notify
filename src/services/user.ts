import { Repository } from "typeorm";
import { ApiError, MainDataSource } from "../configs";
import { UserEntity, UserSecurityKeysEntity } from "../models";
import { userCreateSchema, userResponseSchema, UserResponseType } from "../schemas/user";
import { hashPassword, comparePassword } from "./utils";

export class UserService {
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
        user.password = await hashPassword(validatedResult.data.password);
        await this.userRepository.save(user);
        return userResponseSchema.parse(user);
    }

    async list(filter: Object, limit: number, offset: number) {

    }

    async get(id: string){

    }

    async update(id: string, data: Object){

    }

    async delete(id: string){

    }

    async getByEmail(email: string){
    }

    async renewSecurityKeys(id: string){

    }

    async getSecurityKeys(id: string){
    }
}