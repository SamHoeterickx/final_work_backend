import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { LessonsService } from './lessons.service';
import { EProgressStatus } from '../../shared/types/types';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../shared/guards/gqlAuth.guard';
import { Lesson } from './entity/lesson.entity';
import { User } from '../auth/entity/user.entity';
import { CurrentUser } from '../../shared/decorators/currentUser.decorator';
import { CompleteLessonDto } from './dto/completeLesson.dto';
import { CompleteLessonResponse } from './complete-lesson-response.model';
import { StartLessonDto } from './dto/startLesson.dto';

@Resolver(() => Lesson)
@UseGuards(GqlAuthGuard)
export class LessonsResolver {
    constructor(private readonly lessonsService: LessonsService) {}

    @Query(() => Lesson)
    async startLesson(
        @Args('input') input: StartLessonDto,
        @CurrentUser() user: User
    ): Promise<Lesson> {
        return await this.lessonsService.startLesson(input.lessonUuid, user.uuid)
    }


    @ResolveField(() => EProgressStatus)
    async status(
        @Parent() lesson: Lesson,
        @CurrentUser() user: User
    ): Promise<EProgressStatus> {
        return await this.lessonsService.getLessonStatusForUser(lesson.uuid, user.uuid);
    }

    @Mutation(() => CompleteLessonResponse)
    async completeLesson(
        @CurrentUser() user: User,
        @Args('input') input: CompleteLessonDto
    ): Promise<CompleteLessonResponse> {
        return this.lessonsService.completeLesson(input.lessonUuid, user.uuid);
    }

}
