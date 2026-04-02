import { Module } from '@nestjs/common';
import { ChapterResolver } from './chapter.resolver';
import { ChapterService } from './chapter.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chapter } from './entity/chapter.entity';
import { Lesson } from '../lesson/entity/lesson.entity';
import { AuthService } from '../auth/auth.service';
import { User } from '../user/entity/user.entity';
import { AuthModule } from '../auth/auth.module';
import { TokenService } from 'src/shared/token/token.service';

@Module({
    imports: [TypeOrmModule.forFeature([Chapter, Lesson, User]), AuthModule],
    providers: [ChapterResolver, ChapterService, AuthService, TokenService],
    exports: [ChapterService],
})
export class ChapterModule {}
