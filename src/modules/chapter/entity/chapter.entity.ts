import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Lesson } from '../../lesson/entity/lesson.entity';
import { TagOptions } from '../../../shared/types/types';
import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity('chapter')
export class Chapter {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Field()
    @Column()
    name: string;

    @Field()
    @Column()
    description: string;

    @Field(() => Int)
    @Column({ type: 'int' })
    order: number;

    @Field(() => [TagOptions], { nullable: true })
    @Column({
        type: 'enum',
        enum: TagOptions,
        default: [TagOptions.TEST],
        array: true,
        nullable: true,
    })
    tags?: TagOptions[] | null;

    @Field(() => [Lesson])
    @OneToMany(() => Lesson, (lesson) => lesson.chapter)
    lessons: Lesson[];

    @Field()
    @CreateDateColumn()
    created_at: Date;
}
