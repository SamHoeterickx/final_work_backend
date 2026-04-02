import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { UserProgress } from './entity/user_progress.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(UserProgress)
        private userProgressRepository: Repository<UserProgress>,
    ) {}

    /** Update Progress status of user for a specific lesson
     * 
     * @param lessionUuid: string uuid of the lesson
     * @param userUuid - string uuid of the user
     * 
     */
    public async updateLessonProgress(lessonUuid: string, userUuid: string) {
        try {
            const uProgress = await this.userProgressRepository.update(
                {
                    user: { uuid: userUuid },
                    lesson: { uuid: lessonUuid },
                },
                {
                    isCompleted: true,
                },
            );
            
            console.log(uProgress)

            if(uProgress.affected === 0){
                throw new HttpException(
                    'Failed to update progress, incorrect user or lesson',
                    HttpStatus.NOT_FOUND
                )
            }

            return {
                status: 'successfull'
            }
        } catch (error) {
            throw new HttpException(
                `${error instanceof Error ? error.message : String(error)}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
