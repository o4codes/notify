import { Entity, Column, OneToOne, JoinColumn, Or } from 'typeorm';
import { IsAlphanumeric, IsEmail, IsString } from 'class-validator'
import { BaseEntity } from './commons';


@Entity("organizations")
export class OrganizationEntity extends BaseEntity {

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

    @OneToOne(() => OrganizationSecurityKeys, security_keys => security_keys.organization)
    security_keys: OrganizationSecurityKeys
}


@Entity("orgnaization_security_keys")
export class OrganizationSecurityKeys extends BaseEntity {

    @OneToOne(() => OrganizationEntity, (organization) => organization.security_keys)
    @JoinColumn()
    organization: OrganizationEntity

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