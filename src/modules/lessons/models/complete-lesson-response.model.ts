import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UserStreaks } from '../../auth/entity/user_streak.entity';
import { Lesson } from '../entity/lesson.entity';
import { Chapter } from '../../chapters/entity/chapter.entity';

@ObjectType()
export class CompleteLessonResponse {
    @Field(() => Boolean)
    success: boolean;

    @Field()
    message: string;

    @Field(() => Int, { nullable: true })
    prevUserXP: number | null;

    @Field(() => Int, { nullable: true })
    newUserXP: number | null;

    @Field(() => Int, { nullable: true })
    prevStreak: number | null;

    @Field(() => Int, { nullable: true })
    newStreak: number | null;

    @Field(() => UserStreaks, { nullable: true })
    streak: UserStreaks | null;

    @Field(() => Boolean)
    isStreakUpdated: boolean;

    @Field(() => Boolean)
    isLastLesson: boolean;

    @Field(() => Lesson, { nullable: true })
    newUnlockedLesson: Lesson | null;

    @Field(() => Chapter, { nullable: true })
    newUnlockedChapter: Chapter | null;

    @Field(() => Boolean, { defaultValue: false })
    alreadyCompleted: boolean;
}
