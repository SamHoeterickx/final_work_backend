import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Chapter } from '../../chapters/entity/chapter.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { EProgressStatus } from '../../../shared/types/types';

@ObjectType()
@Entity('lessons')
export class Lesson {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Field()
    @Column()
    name: string;

    @Field()
    @Column()
    description: string;

    @Field()
    @Column()
    estimatedDuration: number;

    @Field()
    @Column({ type: 'text' })
    content: string;

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
