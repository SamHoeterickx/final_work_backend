import { UserRoleType } from "src/shared/types/types";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column()
    firstname: string;

    @Column()
    lastname: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({
        type: 'enum',
        enum: UserRoleType,
        default: UserRoleType.USER
    })
    role: UserRoleType;

    @CreateDateColumn()
    created_at: Date;
}