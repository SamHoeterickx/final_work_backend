import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Lesson } from './entity/lesson.entity';
import { Repository } from 'typeorm';
import { LessonUser } from './entity/lesson_user.entity';

@Injectable()
export class LessonsService {
    constructor(
        @InjectRepository(Lesson) private lessonsRepository: Repository<Lesson>,
        @InjectRepository(LessonUser) public lessonProgressRepository: Repository<LessonUser>
    ){}
}
