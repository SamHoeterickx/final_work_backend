import { Module } from '@nestjs/common';
import { ChapterResolver } from './chapter.resolver';
import { ChapterService } from './chapter.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chapter } from './entity/chapter.entity';
import { Lesson } from '../lesson/entity/lesson.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Chapter, Lesson])],
  providers: [ChapterResolver, ChapterService]
})
export class ChapterModule {}
