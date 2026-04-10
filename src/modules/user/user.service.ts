import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { UserProgress } from './entity/user_progress.entity';
import { ChapterService } from '../chapter/chapter.service';
import { FindUserField, GetChapterOptionEnum } from 'src/shared/types/types';
import { Lesson } from '../lesson/entity/lesson.entity';
import { FindUserOption } from './dto/findUserOption.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(UserProgress)
        private userProgressRepository: Repository<UserProgress>,
        private chapterService: ChapterService,
    ) {}

    // ------------------------------
    // --- USERPROGRESS FUNCTIONS ---
    // ------------------------------

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

            console.log(uProgress);

            if (uProgress.affected === 0) {
                throw new HttpException(
                    'Failed to update progress, incorrect user or lesson',
                    HttpStatus.NOT_FOUND,
                );
            }

            return {
                status: 'successfull',
            };
        } catch (error) {
            throw new HttpException(
                `${error instanceof Error ? error.message : String(error)}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    /**
     * Create new database entries for progress for all the lessons in a chapter for a user
     *
     * @param chapterUuid - string
     * @param userUuid - string
     *
     * @throws HttpException
     */
    public async createUserProgressNewChapter(
        chapterUuid: string,
        userUuid: string,
    ) {
        try {
            const chapter = await this.chapterService.findBy({
                option: GetChapterOptionEnum.UUID,
                value: chapterUuid,
            });

            const user = await this.findBy({
                option: FindUserField.UUID,
                value: userUuid,
            });

            if (chapter) {
                const chapterLessons: Lesson[] = chapter.lessons;

                for (const lesson of chapterLessons) {
                    const nProgressEntry = this.userProgressRepository.create({
                        user,
                        lesson,
                    });

                    await this.userProgressRepository.save(nProgressEntry);
                }
            }
        } catch (error) {
            throw new HttpException(
                `${error instanceof Error ? error.message : String(error)}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    public async findUserProgress(
        lessionUuid: string,
        userUuid: string,
    ): Promise<UserProgress | null> {
        try {
            const uProgress = await this.userProgressRepository.findOne({
                where: {
                    lesson: { uuid: lessionUuid },
                    user: { uuid: userUuid },
                },
            });

            return uProgress
        } catch (error) {
            throw new HttpException(
                `${error instanceof Error ? error.message : String(error)}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    // ----------------------
    // --- USER FUNCTIONS ---
    // ----------------------

    /**
     * Find user by findOption
     *
     * @param findOption - FindUserOption
     * - option: FindUserField 'uuid' | 'firstname' | 'email' | 'role'
     * - value: string
     *
     * @returns
     * a Promise containing a user
     *
     * @throws HttpException when user is not found
     */
    private async findBy(findOption: FindUserOption): Promise<User> {
        try {
            const { option, value } = findOption;

            const user = await this.userRepository.findOne({
                where: {
                    [option]: value,
                },
            });

            if (!user) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }

            return user;
        } catch (error) {
            throw new HttpException(
                `${error instanceof Error ? error.message : String(error)}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
