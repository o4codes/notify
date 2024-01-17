import { Repository } from "typeorm";
import { MainDataSource } from "../configs";
import { UserEntity, UserSecurityKeysEntity } from "../models";

export class UserService {
    private userRepository: Repository<UserEntity>;
    private userKeysRepository: Repository<UserSecurityKeysEntity>;

    constructor() {
        this.userRepository = MainDataSource.getRepository(UserEntity);
        this.userKeysRepository = MainDataSource.getRepository(UserSecurityKeysEntity);
    }

    async create(){
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