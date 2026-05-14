import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { ChaptersService } from './chapters.service';
import { CurrentUser } from '../../shared/decorators/currentUser.decorator';
import { User } from '../auth/entity/user.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../shared/guards/gqlAuth.guard';
import { ChapterUser } from './entity/chapter_user.entity';

@Resolver()
@UseGuards(GqlAuthGuard)
export class ChaptersResolver {
    constructor(private chaptersService: ChaptersService) {}

    @Query(() => [ChapterUser])
    public async getMyChapters(@CurrentUser() user: User) {
        return await this.chaptersService.getMyChapters(user.uuid);
    }

    @Mutation(() => Boolean)
    public async unlockNewChapter(@CurrentUser() user: User) {
        console.log(user);
        return await this.chaptersService.unlockNewChapter(user.uuid);
    }

    @Mutation(() => Boolean)
    public async generateCustomRoadmap(
        @CurrentUser() user: User,
    ): Promise<boolean> {
        return await this.chaptersService.generateCustomRoadmap(user.uuid);
    }
}
