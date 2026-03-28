import { Field, ID, ObjectType } from '@nestjs/graphql';
import { type IOnboardingData } from '../../../shared/types/types';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@ObjectType()
@Entity('user_profiles')
export class UserProfile {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column('text', { array: true })
    currentBehaviour: string[];

    @Column()
    experienceLevel: string;

    @Column('text')
    goal: string;

    @Column()
    currentPreference: string;

    @Column()
    desiredTempo: string;

    @Column('text', { array: true, nullable: true })
    currentMethodes: string[] | null;

    @Column('text', { array: true, nullable: true })
    extraGear: string[] | null;

    @Column({ type: 'jsonb', nullable: true })
    fullOnboardingData: IOnboardingData | null;

    @OneToOne(() => User)
    @JoinColumn()
    user: User;

    @CreateDateColumn()
    created_at: Date;
}
