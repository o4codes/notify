import { Entity, Column, OneToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "./commons";
import { UserEntity } from "./user";
import { IsEmail, IsNumberString, IsString } from "class-validator";

@Entity("message_configurations")
export class MessageConfiguration extends BaseEntity {
    
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

    @Column(
        {
            type: "varchar",
            unique: true,
            length: 256,
            nullable: true
        }
    )
    @IsString()
    fcmToken: string;
}