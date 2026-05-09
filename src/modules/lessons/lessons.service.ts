import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson } from './entity/lesson.entity';
import { LessonUser } from './entity/lesson_user.entity';
import { EProgressStatus } from '../../shared/types/types';

@Injectable()
export class LessonsService {
    constructor(
        @InjectRepository(Lesson) private lessonRepository: Repository<Lesson>,
        @InjectRepository(LessonUser) private lessonUserRepository: Repository<LessonUser>,
    ) {}

    public async getLessonStatusForUser(lessonUuid: string, userUuid: string): Promise<EProgressStatus> {
        try {
            const progress = await this.lessonUserRepository.findOne({
                where: { 
                    lesson: { uuid: lessonUuid }, 
                    user: { uuid: userUuid } 
                }
            });
            return progress ? progress.status : EProgressStatus.LOCKED;
            
        } catch (error) {
            console.error(`Fout bij ophalen van les-status voor user ${userUuid}:`, error);
            return EProgressStatus.LOCKED; 
        }
    }
}