import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Chapter } from '../../chapters/entity/chapter.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { EProgressStatus } from '../../../shared/types/types';
import { LessonTranslation } from './lesson_translation.entity';

@ObjectType()
@Entity('lessons')
export class Lesson {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Field(() => [LessonTranslation])
    @OneToMany(() => LessonTranslation, (translation) => translation.lesson, {
        cascade: true,
        eager: true,
    })
    translations: LessonTranslation[];

    @Field()
    @Column()
    estimatedDuration: number;

    @Field(() => Chapter, { nullable: true })
    @ManyToOne(() => Chapter, (chapter) => chapter.lessons)
    chapter: Chapter;

    @Field(() => EProgressStatus)
    status: EProgressStatus;

    @Field({ defaultValue: 10 })
    @Column({ default: 0 })
    xp: number;

    @Field()
    @Column()
    order: number;

    @Field()
    @CreateDateColumn()
    created_at: Date;
}
