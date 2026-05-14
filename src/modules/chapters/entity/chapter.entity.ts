import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Lesson } from '../../lessons/entity/lesson.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity('chapters')
export class Chapter {
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
