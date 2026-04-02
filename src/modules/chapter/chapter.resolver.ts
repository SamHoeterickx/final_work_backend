import { Args, Query, Resolver } from '@nestjs/graphql';
import { ChapterService } from './chapter.service';
import { Chapter } from './entity/chapter.entity';
import { GqlAuthGuard } from 'src/shared/guards/gqlAuth.guard';
import { UseGuards } from '@nestjs/common';
import { GetChapterOption } from './dto/getChapterOption.dto';
import { ChapterFieldInput } from './dto/chapterFilterInput.dto';

@Resolver()
@UseGuards(GqlAuthGuard)
export class ChapterResolver {
    constructor(private chapterService: ChapterService) {}

    @Query(() => [Chapter])
    public async getAllChapters(): Promise<Chapter[]> {
        return await this.chapterService.findAll();
    }

    @Query(() => [Chapter])
    public async getChaptersBy(
        @Args('option') option: ChapterFieldInput,
    ): Promise<Chapter[]> {
        return await this.chapterService.findAllBy(option);
    }

    @Query(() => Chapter)
    public async getChapter(@Args('option') option: GetChapterOption) {
        return await this.chapterService.findBy(option);
    }
}
