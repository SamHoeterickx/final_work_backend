import { Resolver, Query, ResolveField, Parent } from '@nestjs/graphql';
import { LessonService } from './lesson.service';
import { Lesson } from './entity/lesson.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/shared/guards/gqlAuth.guard';
import { CurrentUser } from 'src/shared/decorators/currentUser.decorator';
import { User } from '../user/entity/user.entity';
import { UserService } from '../user/user.service';

@Resolver(() => Lesson)
@UseGuards(GqlAuthGuard)
export class LessonResolver {
    constructor(
        private lessonService: LessonService,
        private userService: UserService,
    ) {}

    @Query(() => [Lesson])
    public async getAllLessons(): Promise<Lesson[]> {
        return await this.lessonService.findAll();
    }

    @ResolveField(() => Boolean)
    async isCompleted(
        @Parent() lesson: Lesson,
        @CurrentUser() user: User,
    ): Promise<boolean> {
        if (!user) return false;
        const uProgress = await this.userService.findUserProgress(lesson.uuid, user.uuid);

        return uProgress ? uProgress.isCompleted : false;
    }

    @ResolveField(() => Boolean)
    async isUnlocked(
        @Parent() lesson: Lesson,
        @CurrentUser() user: User,
    ): Promise<boolean> {
        if (!user) return false;

        const progress = await this.userService.findUserProgress(
            lesson.uuid,
            user.uuid,
        );
        return !!progress;
    }
}
