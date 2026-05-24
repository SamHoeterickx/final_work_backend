import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Lesson } from '../../lessons/entity/lesson.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import GraphQLJSON from 'graphql-type-json';

@ObjectType()
@Entity('chapters')
export class Chapter {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Field(() => GraphQLJSON)
    @Column({ type: 'jsonb' })
    name: any;

    @Field()
    @Column()
    slug: string;

    @Field(() => GraphQLJSON)
    @Column({ type: 'jsonb' })
    description: any;

    @Field(() => [Lesson], { nullable: true })
    @OneToMany(() => Lesson, (lesson) => lesson.chapter)
    lessons: Lesson[];

    @Field(() => [String])
    @Column('text', { array: true })
    tags: string[];

    @Field()
    @CreateDateColumn()
    created_at: Date;
}
