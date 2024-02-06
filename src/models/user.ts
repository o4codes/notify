import { Entity, Column, OneToOne, JoinColumn, Or } from 'typeorm';
import { IsAlphanumeric, IsBoolean, IsEmail, IsNumberString, IsString } from 'class-validator'
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
    securityKeys: UserSecurityKeysEntity;

    @OneToOne(() => UserMessageConfiguration, (message_configs) => message_configs.user)
    messageConfig: UserMessageConfiguration;
}


@Entity("user_security_keys")
export class UserSecurityKeysEntity extends BaseEntity {

    @OneToOne(() => UserEntity, (user) => user.securityKeys)
    @JoinColumn()
    user: UserEntity;

    @Column({
        type: "varchar",
        length: 256,
        unique: true
    })
    @IsAlphanumeric()
    publicKey: string;

    @Column({
        type: "varchar",
        length: 256,
        unique: true
    })
    @IsAlphanumeric()
    secretKey: string;
}


@Entity("message_configurations")
export class UserMessageConfiguration extends BaseEntity {
    
    @OneToOne(() => UserEntity, user => user.messageConfig)
    @JoinColumn()
    user: UserEntity;

    @Column({
        type: "varchar",
        unique: true,
        length: 128,
        nullable: true
    })
    @IsEmail()
    sourceEmailAddress: string;

    @Column({
        type: "varchar",
        unique: true,
        length: 128,
        nullable: true
    })
    @IsNumberString()
    sourceMobileNumber: string;

    @Column({
            type: "varchar",
            unique: true,
            length: 256,
            nullable: true
    })
    @IsString()
    fcmToken: string;
}