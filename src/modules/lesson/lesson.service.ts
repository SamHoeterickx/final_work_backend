import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Lesson } from './entity/lesson.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LessonService {
    constructor(
        @InjectRepository(Lesson) private lessonRepository: Repository<Lesson>,
    ) {}

    public async findAll(): Promise<Lesson[]> {
        try {
            const allLessons = await this.lessonRepository.find({
                relations: ['prerequisites'],
            });
            if (!allLessons || allLessons.length === 0) {
                throw new HttpException(
                    'No lessons found',
                    HttpStatus.NOT_FOUND,
                );
            }

            return allLessons;
        } catch (error) {
            throw new HttpException(
                'Failed to fetch lessons',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
