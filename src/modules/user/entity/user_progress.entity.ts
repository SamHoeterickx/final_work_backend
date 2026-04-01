import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Lesson } from '../../lesson/entity/lesson.entity';

@ObjectType()
@Entity('user_progress')
export class UserProgress {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Field()
    @Column({ type: 'boolean', default: false })
    isCompleted: boolean;

    @Field(() => User)
    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    user: User;

    @Field(() => Lesson)
    @ManyToOne(() => Lesson, { onDelete: 'CASCADE' })
    lesson: Lesson;

    @CreateDateColumn()
    completed_at: Date;
}
