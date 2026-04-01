import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chapter } from './entity/chapter.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChapterService {
    constructor(
        @InjectRepository(Chapter)
        private chapterRepository: Repository<Chapter>,
    ) {}

    public async findAll(): Promise<Chapter[]> {
        try {
            const allChapters = await this.chapterRepository.find({
                relations: ['lessons'],
                order: {
                    order: 'ASC',
                    lessons: {
                        order: 'ASC',
                    },
                },
            });
            if (!allChapters || allChapters.length === 0) {
                throw new HttpException(
                    'No chapters found',
                    HttpStatus.NOT_FOUND,
                );
            }

            return allChapters;
        } catch (error) {
            throw new HttpException(
                `${error instanceof Error ? error.message : String(error)}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    public async findBySlug(slug: string): Promise<Chapter> {
        try {
            const chapter = await this.chapterRepository.findOne({
                where: {
                    slug,
                },
                relations: ['lessons'],
                order: {
                    order: 'ASC',
                    lessons: {
                        order: 'ASC',
                    },
                },
            });
            if (!chapter) {
                throw new HttpException(
                    'No chapters found',
                    HttpStatus.NOT_FOUND,
                );
            }

            return chapter;
        } catch (error) {
            throw new HttpException(
                `${error instanceof Error ? error.message : String(error)}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
