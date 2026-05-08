import { Module } from '@nestjs/common';
import { ChaptersResolver } from './chapters.resolver';
import { ChaptersService } from './chapters.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chapter } from './entity/chapter.entity';
import { ChapterUser } from './entity/chapter_user.entity';
import { AuthModule } from '../auth/auth.module';
import { TokenService } from '../../shared/token/token.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Chapter, ChapterUser]),
        AuthModule
    ],
    providers: [ChaptersResolver, ChaptersService, TokenService]
})
export class ChaptersModule {}
