import { Module } from '@nestjs/common';
import { LessonsResolver } from './lessons.resolver';
import { LessonsService } from './lessons.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lesson } from './entity/lesson.entity';
import { LessonUser } from './entity/lesson_user.entity';
import { AuthModule } from '../auth/auth.module';
import { TokenService } from '../../shared/token/token.service';
import { XpService } from '../xp/xp.service';
import { User } from '../auth/entity/user.entity';
import { ChapterUser } from '../chapters/entity/chapter_user.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Lesson, LessonUser, User, ChapterUser]),
        AuthModule
    ],
    providers: [LessonsResolver, LessonsService, TokenService, XpService],
    exports: [LessonsService]
})
export class LessonsModule {}
