import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsDate } from 'class-validator'


export abstract class BaseEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string;


    @CreateDateColumn()
    @IsDate()
    createdDateTime: Date;


    @UpdateDateColumn()
    @IsDate()
    updatedDateTime: Date;
}