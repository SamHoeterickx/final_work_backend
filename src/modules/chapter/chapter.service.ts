import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chapter } from './entity/chapter.entity';
import { Repository } from 'typeorm';
import { GetChapterOption } from './dto/getChapterOption.dto';

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

    /**
     * Find a chapter based on the findOption
     * 
     * @param findOption - GetChapterOption
     * - option: 'uuid' | 'slug' | 'name'
     * - value: string
     * 
     * @returns
     * a Promise containing the found chapter
     * 
     * @throws Error if there is no Chapter found with the given findOption
     */
    public async findBy(findOption: GetChapterOption): Promise<Chapter> {
        try {
            const { option, value } = findOption;

            const chapter = await this.chapterRepository.findOne({
                where: {
                    [option]: value
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
