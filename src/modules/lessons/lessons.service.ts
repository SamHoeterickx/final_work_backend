import {
    HttpException,
    HttpStatus,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson } from './entity/lesson.entity';
import { LessonUser } from './entity/lesson_user.entity';
import { EProgressStatus } from '../../shared/types/types';
import { XpService } from '../xp/xp.service';
import { ChapterUser } from '../chapters/entity/chapter_user.entity';
import { Chapter } from '../chapters/entity/chapter.entity';
import { CompleteLessonResponse } from './models/complete-lesson-response.model';
import { LessonDto } from './dto/lesson.dto';
import { StartLessonResponse } from './models/start-lesson-response.model';
import { LessonTranslation } from './entity/lesson_translation.entity';

@Injectable()
export class LessonsService {
    constructor(
        @InjectRepository(Lesson) private lessonRepository: Repository<Lesson>,
        @InjectRepository(LessonUser)
        private lessonUserRepository: Repository<LessonUser>,
        @InjectRepository(ChapterUser)
        private chapterUserRepository: Repository<ChapterUser>,
        private xpService: XpService,
    ) {}

    public async startLesson(
        input: LessonDto,
        userUuid: string,
    ): Promise<StartLessonResponse> {
        try {
            const { lessonUuid, languageCode } = input;

            const lessonUser = await this.lessonUserRepository.findOne({
                where: {
                    lesson: { uuid: lessonUuid },
                    user: { uuid: userUuid },
                },
                relations: ['lesson'],
            });

            if (!lessonUser) {
                throw new HttpException(
                    'No lesson progress found',
                    HttpStatus.NOT_FOUND,
                );
            }

            if (lessonUser.status === EProgressStatus.LOCKED) {
                throw new HttpException(
                    'This lesson is still locked',
                    HttpStatus.FORBIDDEN,
                );
            }

            if (
                lessonUser.status === EProgressStatus.COMPLETED ||
                lessonUser.status === EProgressStatus.INPROGRESS
            ) {
                return {
                    uuid: lessonUser.lesson.uuid,
                    estimatedDuration: lessonUser.lesson.estimatedDuration,
                    xp: lessonUser.lesson.xp,
                    order: lessonUser.lesson.order,
                    content: lessonUser.lesson.translations.filter((translation: LessonTranslation) => translation.languageCode === languageCode)
                }
            }

            await this.lessonUserRepository.update(lessonUser.uuid, {
                status: EProgressStatus.INPROGRESS,
            });

            console.log(languageCode);

            return {
                uuid: lessonUser.lesson.uuid,
                estimatedDuration: lessonUser.lesson.estimatedDuration,
                xp: lessonUser.lesson.xp,
                order: lessonUser.lesson.order,
                content: lessonUser.lesson.translations.filter((translation: LessonTranslation) => translation.languageCode === languageCode)
            }

        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(
                `Failed to start lesson: ${error instanceof Error ? error.message : String(error)}`,
            );
        }
    }

    public async getLessonStatusForUser(
        lessonUuid: string,
        userUuid: string,
    ): Promise<EProgressStatus> {
        try {
            const progress = await this.lessonUserRepository.findOne({
                where: {
                    lesson: { uuid: lessonUuid },
                    user: { uuid: userUuid },
                },
            });
            return progress ? progress.status : EProgressStatus.LOCKED;
        } catch (error) {
            console.error(
                `Fout bij ophalen van les-status voor user ${userUuid}:`,
                error,
            );
            return EProgressStatus.LOCKED;
        }
    }

    public async completeLesson(
        input: LessonDto,
        userUuid: string,
    ): Promise<CompleteLessonResponse | boolean> {
        try {
            const { lessonUuid, languageCode } = input;
            
            const lesson = await this.lessonRepository.findOne({
                where: { uuid: lessonUuid },
                order: {
                    chapter: {
                        lessons: {
                            order: 'ASC',
                        },
                    },
                },
                relations: ['chapter', 'chapter.lessons'],
            });

            const lessonUser = await this.lessonUserRepository.findOne({
                where: {
                    lesson: { uuid: lessonUuid },
                    user: { uuid: userUuid },
                },
            });

            if (!lesson || !lessonUser) {
                throw new HttpException(
                    'No lesson found',
                    HttpStatus.NOT_FOUND,
                );
            }

            if (lessonUser.status === EProgressStatus.LOCKED) {
                throw new HttpException(
                    'This lesson is still locked',
                    HttpStatus.FORBIDDEN,
                );
            }

            if (lessonUser.status === EProgressStatus.COMPLETED) {
                return {
                    success: true,
                    message: 'Lesson was already completed',
                    prevUserXP: 0,
                    newUserXP: 0,
                    prevStreak: 0,
                    newStreak: 0,
                    streak: null,
                    isStreakUpdated: false,
                    isLastLesson: false,
                    newUnlockedLesson: null,
                    newUnlockedChapter: null,
                    alreadyCompleted: true,
                };
            }

            const amountOfLessonsInChapter =
                lesson.chapter?.lessons?.length || 0;
            const nextLesson = lesson.chapter.lessons.find(
                (l) => l.order > lesson.order,
            );
            const isLastLesson = !nextLesson;
            const earnedXP = lesson.xp;

            const updatedXP = await this.xpService.updateUserXP(
                userUuid,
                earnedXP,
                isLastLesson,
                amountOfLessonsInChapter,
            );
            await this.lessonUserRepository.update(lessonUser.uuid, {
                status: EProgressStatus.COMPLETED,
            });

            let newUnlockedLesson: Lesson | null = null;
            let newUnlockedChapter: Chapter | null = null;

            if (!isLastLesson && nextLesson) {
                const nextLessonUser = await this.lessonUserRepository.findOne({
                    where: {
                        lesson: { uuid: nextLesson.uuid },
                        user: { uuid: userUuid },
                    },
                    relations: ['lesson', 'lesson.translations'],
                });

                if (!nextLessonUser) {
                    throw new HttpException(
                        'No lesson found',
                        HttpStatus.NOT_FOUND,
                    );
                }

                await this.lessonUserRepository.update(nextLessonUser.uuid, {
                    status: EProgressStatus.UNLOCKED,
                });
                newUnlockedLesson = nextLessonUser.lesson;
                if (newUnlockedLesson.translations) {
                    newUnlockedLesson.translations = newUnlockedLesson.translations.filter(
                        (translation: LessonTranslation) =>
                            translation.languageCode === languageCode,
                    );
                }
            }

            if (isLastLesson) {
                const chapterUser = await this.chapterUserRepository.findOne({
                    where: {
                        chapter: { uuid: lesson.chapter.uuid },
                        user: { uuid: userUuid },
                    },
                });

                if (!chapterUser) {
                    throw new HttpException(
                        'No chapter progress found for this user',
                        HttpStatus.NOT_FOUND,
                    );
                }

                chapterUser.status = EProgressStatus.COMPLETED;
                await this.chapterUserRepository.save(chapterUser);

                const nextChapterUser =
                    await this.chapterUserRepository.findOne({
                        where: {
                            user: { uuid: userUuid },
                            order: chapterUser.order + 1,
                        },
                        relations: ['chapter', 'user'],
                    });

                if (
                    nextChapterUser &&
                    nextChapterUser.status === EProgressStatus.LOCKED
                ) {
                    nextChapterUser.status = EProgressStatus.UNLOCKED;
                    await this.chapterUserRepository.save(nextChapterUser);
                    newUnlockedChapter = nextChapterUser.chapter;
                }
            }

            return {
                success: true,
                message: 'Lesson completed successfully',
                ...updatedXP,
                isStreakUpdated: updatedXP.isStreaksUpdated,
                isLastLesson,
                newUnlockedLesson,
                newUnlockedChapter,
                alreadyCompleted: false,
            };
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(
                `Failed to complete lesson: ${error instanceof Error ? error.message : String(error)}`,
            );
        }
    }
}
