import { Args, Query, Resolver } from '@nestjs/graphql';
import { ChapterService } from './chapter.service';
import { Chapter } from './entity/chapter.entity';
import { GqlAuthGuard } from 'src/shared/guards/gqlAuth.guard';
import { UseGuards } from '@nestjs/common';

@Resolver()
@UseGuards(GqlAuthGuard)
export class ChapterResolver {
    constructor(private chapterService: ChapterService) {}

    @Query(() => [Chapter])
    public async getAllChapters(): Promise<Chapter[]> {
        return await this.chapterService.findAll();
    }

    @Query(() => Chapter)
    public getChapterBySlug(
        @Args('slug') slug: string
    ){
        console.log(slug);
        return this.chapterService.findBySlug(slug)
    }
}
