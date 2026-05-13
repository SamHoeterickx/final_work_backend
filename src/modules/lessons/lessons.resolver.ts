import { Args, Mutation, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { LessonsService } from './lessons.service';
import { EProgressStatus } from '../../shared/types/types';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../shared/guards/gqlAuth.guard';
import { Lesson } from './entity/lesson.entity';
import { User } from '../auth/entity/user.entity';
import { CurrentUser } from '../../shared/decorators/currentUser.decorator';
import { CompleteLessonDto } from './dto/completeLesson.dto';

@Resolver(() => Lesson)
@UseGuards(GqlAuthGuard)
export class LessonsResolver {
    constructor(private readonly lessonsService: LessonsService) {}

    @ResolveField(() => EProgressStatus)
    async status(
        @Parent() lesson: Lesson,
        @CurrentUser() user: User
    ): Promise<EProgressStatus> {
        return await this.lessonsService.getLessonStatusForUser(lesson.uuid, user.uuid);
    }

    @Mutation(() => Boolean)
    async completeLesson(
        @CurrentUser() user: User,
        @Args('input') input: CompleteLessonDto
    ){
        return this.lessonsService.completeLesson(input.lessonUuid, user.uuid)
    }
}
