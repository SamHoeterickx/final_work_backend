import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UserStreaks } from '../auth/entity/user_streak.entity';
import { Lesson } from './entity/lesson.entity';
import { Chapter } from '../chapters/entity/chapter.entity';

@ObjectType()
export class CompleteLessonResponse {
    @Field(() => Int)
    prevUserXP: number;

    @Field(() => Int)
    newUserXP: number;

    @Field(() => Int)
    prevStreak: number;

    @Field(() => Int)
    newStreak: number;

    @Field(() => UserStreaks)
    streak: UserStreaks;

    @Field(() => Boolean)
    isLastLesson: boolean;

    @Field(() => Lesson, { nullable: true })
    newUnlockedLesson: Lesson | null;

    @Field(() => Chapter, { nullable: true })
    newUnlockedChapter: Chapter | null;
}