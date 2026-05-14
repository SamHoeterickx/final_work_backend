import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Lesson } from './lesson.entity';
import { EProgressStatus } from '../../../shared/types/types';
import { User } from '../../auth/entity/user.entity';

@ObjectType()
@Entity('lesson_user')
export class LessonUser {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Field(() => User)
    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    user: User;

    @Field(() => Lesson)
    @ManyToOne(() => Lesson, { onDelete: 'CASCADE' })
    lesson: Lesson;

    @Field(() => String)
    @Column({
        type: 'enum',
        enum: EProgressStatus,
        default: EProgressStatus.LOCKED,
    })
    status: EProgressStatus;

    @Field()
    @CreateDateColumn()
    created_at: Date;
}
