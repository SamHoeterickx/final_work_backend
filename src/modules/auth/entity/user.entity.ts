import { Field, ID, ObjectType } from '@nestjs/graphql';
import { UserRoleType } from '../../../shared/types/types';
import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity('users')
export class User {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Field()
    @Column()
    firstname: string;

    @Field()
    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Field()
    @Column({
        type: 'enum',
        enum: UserRoleType,
        default: UserRoleType.USER,
    })
    role: UserRoleType;

    @Field(() => String, { nullable: true })
    @Column({ type: 'varchar', nullable: true })
    currentHashedRefreshToken: string | null;

    @Field()
    @CreateDateColumn()
    created_at: Date;
}
