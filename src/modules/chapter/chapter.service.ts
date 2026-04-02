import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chapter } from './entity/chapter.entity';
import { ArrayContains, ILike, Repository } from 'typeorm';
import { GetChapterOption } from './dto/getChapterOption.dto';
import { ChapterFieldInput } from './dto/chapterFilterInput.dto';
import { ChapterFilterField } from 'src/shared/types/types';

@Injectable()
export class ChapterService {
    constructor(
        @InjectRepository(Chapter)
        private chapterRepository: Repository<Chapter>,
    ) {}

    /**
     * Find all chapters
     *
     * @returns
     * a Promise containing an array of all the chapters
     *
     * @throws Error if there are no chapters found
     */
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
     * Find all chapters based on the findOption
     *
     * @param findOption - ChapterFieldInput
     * - option: 'name' | 'description' | 'tags' | 'slug'
     * - value: string
     *
     * @returns
     * a Promise containing and array of all the found chapters
     *
     * @throws Error if there is no Chapter found with the given findOption
     */
    public async findAllBy(findOption: ChapterFieldInput): Promise<Chapter[]> {
        try {
            const { option, value } = findOption;
            let whereCondition = {};

            if (option === ChapterFilterField.TAGS) {
                whereCondition = {
                    tags: ArrayContains([value]),
                };
            } else {
                whereCondition = {
                    [option]: ILike(`%${value}%`),
                };
            }

            const allChapters = await this.chapterRepository.find({
                where: whereCondition,
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
                    [option]: value,
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
