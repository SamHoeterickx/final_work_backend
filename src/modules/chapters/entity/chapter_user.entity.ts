import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Chapter } from './chapter.entity';
import { EProgressStatus } from '../../../shared/types/types';
import { User } from '../../auth/entity/user.entity';

@ObjectType()
@Entity('chapter_user')
export class ChapterUser {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Field(() => User)
    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    user: User;

    @Field(() => Chapter)
    @ManyToOne(() => Chapter, { onDelete: 'CASCADE' })
    chapter: Chapter;

    @Field(() => EProgressStatus)
    @Column({
        type: 'enum',
        enum: EProgressStatus,
        default: EProgressStatus.LOCKED,
    })
    status: EProgressStatus;

    @Field()
    @Column()
    order: number;

    @Field()
    @CreateDateColumn()
    created_at: Date;
}
