import { Entity, Column, OneToOne, JoinColumn, Or } from 'typeorm';
import { IsAlphanumeric, IsBoolean, IsEmail, IsString } from 'class-validator'
import { BaseEntity } from './commons';


@Entity("users")
export class UserEntity extends BaseEntity {

    @Column({
        type: "varchar",
        length: 100,
    })
    @IsString()
    name: string;

    @Column({
        type: "varchar",
        length: 100,
        unique: true
    })
    @IsEmail()
    email: string;

    @Column({
        type: "varchar",
        length: 250
    })
    @IsString()
    password: string;

    @OneToOne(() => UserSecurityKeysEntity, (security_keys) => security_keys.user)
    security_keys: UserSecurityKeysEntity;
}


@Entity("user_security_keys")
export class UserSecurityKeysEntity extends BaseEntity {

    @OneToOne(() => UserEntity, (user) => user.security_keys)
    @JoinColumn()
    user: UserEntity;

    @Column({
        type: "varchar",
        length: 250,
        unique: true
    })
    @IsAlphanumeric()
    public_key: string;

    @Column({
        type: "varchar",
        length: 250,
        unique: true
    })
    @IsAlphanumeric()
    secret_key: string;

}