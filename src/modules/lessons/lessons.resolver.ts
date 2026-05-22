import {
    Args,
    Mutation,
    Parent,
    Query,
    ResolveField,
    Resolver,
} from '@nestjs/graphql';
import { LessonsService } from './lessons.service';
import { EProgressStatus } from '../../shared/types/types';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../shared/guards/gqlAuth.guard';
import { Lesson } from './entity/lesson.entity';
import { User } from '../auth/entity/user.entity';
import { CurrentUser } from '../../shared/decorators/currentUser.decorator';
import { CompleteLessonResponse } from './models/complete-lesson-response.model';
import { LessonDto } from './dto/lesson.dto';
import { StartLessonResponse } from './models/start-lesson-response.model';

@Resolver(() => Lesson)
@UseGuards(GqlAuthGuard)
export class LessonsResolver {
    constructor(private readonly lessonsService: LessonsService) {}

    @Query(() => StartLessonResponse)
    async startLesson(
        @Args('input') input: LessonDto,
        @CurrentUser() user: User,
    ): Promise<StartLessonResponse> {
        return await this.lessonsService.startLesson(
            input,
            user.uuid,
        );
    }

    @ResolveField(() => EProgressStatus)
    async status(
        @Parent() lesson: Lesson,
        @CurrentUser() user: User,
    ): Promise<EProgressStatus> {
        return await this.lessonsService.getLessonStatusForUser(
            lesson.uuid,
            user.uuid,
        );
    }

    @Mutation(() => CompleteLessonResponse)
    async completeLesson(
        @CurrentUser() user: User,
        @Args('input') input: LessonDto,
    ): Promise<CompleteLessonResponse | boolean> {
        return this.lessonsService.completeLesson(input, user.uuid);
    }
}
