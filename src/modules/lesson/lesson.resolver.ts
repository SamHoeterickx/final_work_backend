import { Resolver, Query } from '@nestjs/graphql';
import { LessonService } from './lesson.service';
import { Lesson } from './entity/lesson.entity';

@Resolver()
export class LessonResolver {
    constructor(private lessonService: LessonService) {}

    @Query(() => [Lesson])
    public async getAllLessons(): Promise<Lesson[]> {
        return await this.lessonService.findAll();
    }
}
