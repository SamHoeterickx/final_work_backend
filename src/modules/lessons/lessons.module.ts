import { Module } from '@nestjs/common';
import { LessonsResolver } from './lessons.resolver';
import { LessonsService } from './lessons.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lesson } from './entity/lesson.entity';
import { LessonUser } from './entity/lesson_user.entity';
import { AuthModule } from '../auth/auth.module';
import { ChapterUser } from '../chapters/entity/chapter_user.entity';
import { XpModule } from '../xp/xp.module';
import { TokenService } from '../../shared/token/token.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Lesson, LessonUser, ChapterUser]),
        AuthModule,
        XpModule
    ],
    providers: [LessonsResolver, LessonsService, TokenService],
    exports: [LessonsService]
})
export class LessonsModule {}
