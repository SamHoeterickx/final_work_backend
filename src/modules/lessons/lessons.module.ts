import { Module } from '@nestjs/common';
import { LessonsResolver } from './lessons.resolver';
import { LessonsService } from './lessons.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lesson } from './entity/lesson.entity';
import { LessonUser } from './entity/lesson_user.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Lesson, LessonUser])
    ],
    providers: [LessonsResolver, LessonsService]
})
export class LessonsModule {}
