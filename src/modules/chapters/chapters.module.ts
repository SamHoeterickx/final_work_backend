import { Module } from '@nestjs/common';
import { ChaptersResolver } from './chapters.resolver';
import { ChaptersService } from './chapters.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chapter } from './entity/chapter.entity';
import { ChapterUser } from './entity/chapter_user.entity';
import { TokenService } from '../../shared/token/token.service';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Chapter, ChapterUser]),
        AuthModule
    ],
    providers: [ChaptersResolver, ChaptersService, TokenService],
    exports: [ChaptersService]
})
export class ChaptersModule {}
