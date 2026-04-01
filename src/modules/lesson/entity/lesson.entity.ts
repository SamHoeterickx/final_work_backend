import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Chapter } from '../../chapter/entity/chapter.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import GraphQLJSON from 'graphql-type-json';

@ObjectType()
@Entity('lesson')
export class Lesson {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Field()
    @Column()
    name: string;

    @Field()
    @Column()
    slug: string;

    @Field()
    @Column()
    description: string;

    @Field(() => Int)
    @Column({ type: 'int' })
    order: number;

    @Field(() => Int)
    @Column({ type: 'int', default: 1 })
    durationMinutes: number;

    @Field(() => GraphQLJSON)
    @Column({ type: 'jsonb', default: {} })
    content: Record<string, any>;

    @Field(() => [Lesson], { nullable: true })
    @ManyToMany(() => Lesson)
    @JoinTable({
        name: 'lesson_dependencies',
        joinColumn: { name: 'lesson_id', referencedColumnName: 'uuid' },
        inverseJoinColumn: { name: 'prerequisite_id', referencedColumnName: 'uuid' },
    })
    prerequisites: Lesson[];

    @Field(() => Chapter)
    @ManyToOne(() => Chapter, (chapter) => chapter.lessons)
    chapter: Chapter;

    @Field()
    @CreateDateColumn()
    created_at: Date;
}
