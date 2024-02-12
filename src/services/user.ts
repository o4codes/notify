import { Repository } from "typeorm";
import { ApiError, MainDataSource } from "../configs";
import { UserEntity, UserSecurityKeysEntity } from "../models";
import { userCreateSchema, userResponseSchema, userUpdateSchema } from "../schemas/user";
import { CryptoHandler } from "../helpers";
import { UserCreateType, UserResponseType, UserUpdateType } from "../types";

export default class UserService {
    private userRepository: Repository<UserEntity>;
    private userKeysRepository: Repository<UserSecurityKeysEntity>;

    constructor() {
        this.userRepository = MainDataSource.getRepository(UserEntity);
        this.userKeysRepository = MainDataSource.getRepository(UserSecurityKeysEntity);
    }

    /**
     * Create a new user with the provided user data.
     *
     * @param {UserCreateType} userData - the user data to create the user with
     * @return {Promise<UserResponseType>} the newly created user
     */
    async create(userData: UserCreateType): Promise<UserResponseType> {
        const validatedResult = await userCreateSchema.safeParseAsync(userData);
        if (!validatedResult.success) {
            throw new ApiError(400, "Invalid user data", validatedResult.error.format());
        }
        let user = new UserEntity();
        user.name = validatedResult.data.name;
        user.email = validatedResult.data.email;
        user.password = await CryptoHandler.hashPassword(validatedResult.data.password);
        await this.userRepository.save(user);
        return userResponseSchema.parse(user); 
    }

    /**
     * Asynchronously lists items based on the provided filter, limit, and offset.
     *
     * @param {Object} filter - The filter object for querying items.
     * @param {number} limit - The maximum number of items to return. Default is 20.
     * @param {number} offset - The number of items to skip before starting to return items. Default is 0.
     * @return {Promise<Array>} The parsed array of items based on the provided filter, limit, and offset.
     */
    async list(filter: Object, limit: number = 20, offset: number = 0) {
        const users = await this.userRepository.find({
            where: filter,
            take: limit,
            skip: offset
        });
        const parsedUsers = userResponseSchema.array().parse(users);
        return parsedUsers
    }

    /**
     * Asynchronously retrieves a user by their ID.
     *
     * @param {string} id - the ID of the user to retrieve
     * @return {Promise<User>} the user object
     */
    async get(id: string){
        const user = await this.userRepository.findOneBy({ id });
        if (!user) throw new ApiError(404, 'User not found');
        return userResponseSchema.parse(user);
    }

    /**
     * Update user information based on the provided ID and data.
     *
     * @param {string} id - The ID of the user to update
     * @param {UserUpdateType} data - The updated user data
     * @return {Promise<UserResponseType>} The updated user information
     */
    async update(id: string, data: UserUpdateType): Promise<UserResponseType>{
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

    /**
     * Delete a record by ID.
     *
     * @param {string} id - The ID of the record to delete
     * @return {Promise<void>} 
     */
    async delete(id: string): Promise<void> {
        this.get(id)
        await this.userRepository.delete({ id });
    }

    /**
     * Get user by email
     *
     * @param {string} email - the email of the user
     * @return {Promise<UserResponseType>} the user response
     */
    async getByEmail(email: string): Promise<UserResponseType>{
        const user = await this.userRepository.findOneBy({ email });
        if (!user) throw new ApiError(404, 'User not found');
        return userResponseSchema.parse(user);
    }

    async renewSecurityKeys(userId: string){
    }

    async getSecurityKeys(userId: string){
    }

    async deleteSecurityKeys(userId: string){
    }

    async getUserMessageConfiguration(userId: string){
        
    }

    async updateMessageConfiguration(userId: string){
        
    }

    async deleteUserMessageConfig(userId: string){
    }
}