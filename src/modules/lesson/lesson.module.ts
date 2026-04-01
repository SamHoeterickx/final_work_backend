import { Module } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { LessonResolver } from './lesson.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lesson } from './entity/lesson.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Lesson])],
    providers: [LessonService, LessonResolver],
})
export class LessonModule {}
