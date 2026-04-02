import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { CurrentUser } from 'src/shared/decorators/currentUser.decorator';
import { User } from './entity/user.entity';
import { LessonUuidInput } from '../lesson/dto/lessonUuidInput.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/shared/guards/gqlAuth.guard';
import { UpdateLessonProgress } from './models/update-lesson-progress.model';

@Resolver()
@UseGuards(GqlAuthGuard)
export class UserResolver {
    constructor(private userService: UserService) {}

    @Mutation(() => UpdateLessonProgress)
    public async updateLessonProgress(
        @Args('lessonUuid') lessonInput: LessonUuidInput,
        @CurrentUser() user: User,
    ) {
        return await this.userService.updateLessonProgress(lessonInput.uuid, user.uuid);
    }
}
