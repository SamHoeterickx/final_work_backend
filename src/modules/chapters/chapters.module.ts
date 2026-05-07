import { Module } from '@nestjs/common';
import { ChaptersResolver } from './chapters.resolver';
import { ChaptersService } from './chapters.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chapter } from './entity/chapter.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Chapter])
    ],
    providers: [ChaptersResolver, ChaptersService]
})
export class ChaptersModule {}
