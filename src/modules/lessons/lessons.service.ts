import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson } from './entity/lesson.entity';
import { LessonUser } from './entity/lesson_user.entity';
import { EProgressStatus } from '../../shared/types/types';
import { XpService } from '../xp/xp.service';
import { ChapterUser } from '../chapters/entity/chapter_user.entity';
import { Chapter } from '../chapters/entity/chapter.entity';
import { CompleteLessonResponse } from './complete-lesson-response.model';

@Injectable()
export class LessonsService {
    constructor(
        @InjectRepository(Lesson) private lessonRepository: Repository<Lesson>,
        @InjectRepository(LessonUser) private lessonUserRepository: Repository<LessonUser>,
        @InjectRepository(ChapterUser) private chapterUserRepository: Repository<ChapterUser>,
        private xpService: XpService,
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

    public async completeLesson(lessonUuid: string, userUuid: string): Promise<CompleteLessonResponse> {
        try {
            const lesson = await this.lessonRepository.findOne({
                where: { uuid: lessonUuid },
                order: {
                    chapter: {
                        lessons: {
                            order: 'ASC'
                        }
                    }
                },
                relations: ['chapter', 'chapter.lessons'],
            });

            const lessonUser = await this.lessonUserRepository.findOne({
                where: {
                    lesson: { uuid: lessonUuid },
                    user: { uuid: userUuid },
                }
            });

            if(!lesson || !lessonUser) {
                throw new HttpException('No lesson found', HttpStatus.NOT_FOUND);
            }

            if (lessonUser.status === EProgressStatus.COMPLETED) {
                throw new HttpException('Lesson already completed', HttpStatus.BAD_REQUEST);
            }

            const amountOfLessonsInChapter = lesson.chapter?.lessons?.length || 0;
            const nextLesson = lesson.chapter.lessons.find(l => l.order > lesson.order);
            const isLastLesson = !nextLesson;
            const earnedXP = lesson.xp;

            const updatedXP = await this.xpService.updateUserXP(userUuid, earnedXP, isLastLesson, amountOfLessonsInChapter);
            await this.lessonUserRepository.update(lessonUser.uuid, { status: EProgressStatus.COMPLETED });

            let newUnlockedLesson: Lesson | null = null;
            let newUnlockedChapter: Chapter | null = null;

            if(!isLastLesson && nextLesson){

                const nextLessonUser = await this.lessonUserRepository.findOne({
                    where: {
                        lesson: { uuid: nextLesson.uuid },
                        user: { uuid: userUuid }
                    },
                    relations: ['lesson']
                });

                if(!nextLessonUser){
                    throw new HttpException('No lesson found', HttpStatus.NOT_FOUND);
                }

                await this.lessonUserRepository.update(nextLessonUser.uuid, { status: EProgressStatus.UNLOCKED })
                newUnlockedLesson = nextLessonUser.lesson
            }

            if(isLastLesson){
                const chapterUser = await this.chapterUserRepository.findOne({
                    where: {
                        chapter: { uuid: lesson.chapter.uuid },
                        user: { uuid: userUuid }
                    }
                });

                if(!chapterUser){
                    throw new HttpException('No chapter progress found for this user', HttpStatus.NOT_FOUND);
                }

                chapterUser.status = EProgressStatus.COMPLETED;
                await this.chapterUserRepository.save(chapterUser);

                const nextChapterUser = await this.chapterUserRepository.findOne({
                    where: { user: { uuid: userUuid }, order: chapterUser.order + 1 },
                    relations: ['chapter', 'user'] 
                });

                if (nextChapterUser && nextChapterUser.status === EProgressStatus.LOCKED) {
                    nextChapterUser.status = EProgressStatus.UNLOCKED;
                    await this.chapterUserRepository.save(nextChapterUser);
                    newUnlockedChapter = nextChapterUser.chapter;
                }
            }

            return {
                ...updatedXP,
                isLastLesson,
                newUnlockedLesson,
                newUnlockedChapter
            }
            
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(`Failed to complete lesson: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}