import { Field, ID, ObjectType } from '@nestjs/graphql';
import { EUserLevels, UserRoleType } from '../../../shared/types/types';
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
    name: string;

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

    @Field()
    @Column({
        type: 'enum',
        enum: EUserLevels,
        default: EUserLevels.BEGINNER
    })
    level: EUserLevels;

    @Field()
    @Column({ default: 0 })
    xp: number;

    @Field()
    @Column({ default: 0 })
    streaks: number;

    @Column({ type: 'varchar', nullable: true })
    passwordResetCode: string | null;

    @Column({ type: 'timestamp', nullable: true })
    passwordResetExpires: Date | null;

    @Field(() => String, { nullable: true })
    @Column({ type: 'varchar', nullable: true })
    currentHashedRefreshToken: string | null;

    @Field()
    @CreateDateColumn()
    created_at: Date;
}
