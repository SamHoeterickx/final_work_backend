import { Field, ID, ObjectType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { ELocales } from '../../../shared/types/types';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Lesson } from './lesson.entity';

@ObjectType()
@Entity('lesson_translations')
export class LessonTranslation {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Field(() => ELocales)
    @Column({
        type: 'enum',
        enum: ELocales,
    })
    languageCode: ELocales;

    @Field()
    @Column()
    name: string;

    @Field()
    @Column()
    description: string;

    @Field(() => GraphQLJSON)
    @Column({ type: 'jsonb' })
    content: any;

    @ManyToOne(() => Lesson, (lesson) => lesson.translations, {
        onDelete: 'CASCADE',
    })
    lesson: Lesson;
}
