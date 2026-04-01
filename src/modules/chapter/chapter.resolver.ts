import { Query, Resolver } from '@nestjs/graphql';
import { ChapterService } from './chapter.service';
import { Chapter } from './entity/chapter.entity';


@Resolver()
export class ChapterResolver {
    constructor(
        private chapterService: ChapterService
    ){}

    @Query(() => [Chapter])
    public async getAllChapters(): Promise<Chapter[]>{
        return await this.chapterService.findAll()
    }
}
