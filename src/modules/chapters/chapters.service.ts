import {
    HttpException,
    HttpStatus,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chapter } from './entity/chapter.entity';
import { Repository } from 'typeorm';
import { ChapterUser } from './entity/chapter_user.entity';
import { EProgressStatus } from '../../shared/types/types';
import { LessonUser } from '../lessons/entity/lesson_user.entity';
import { AuthService } from '../auth/auth.service';
import { LessonsService } from '../lessons/lessons.service';
import { UserProfile } from '../auth/entity/user_profile.entity';

@Injectable()
export class ChaptersService {
    constructor(
        @InjectRepository(Chapter)
        private chapterRepository: Repository<Chapter>,
        @InjectRepository(ChapterUser)
        private chapterProgressRepository: Repository<ChapterUser>,
        private authService: AuthService,
        private lessonsService: LessonsService,
    ) {}

    /**
     * Get all Chapters for a person
     * @param uuid - user uuid
     * @returns a Promise containing an array of ChapterUser entity
     */
    public async getMyChapters(uuid: string): Promise<ChapterUser[]> {
        try {
            const uChapterProgress = await this.chapterProgressRepository.find({
                where: { user: { uuid } },
                relations: [
                    'chapter',
                    'chapter.lessons',
                    'chapter.lessons.translations',
                ],
                order: {
                    order: 'ASC',
                    chapter: {
                        lessons: {
                            order: 'ASC',
                        },
                    },
                },
            });

            if (!uChapterProgress || uChapterProgress.length === 0) {
                throw new HttpException(
                    'No chapters found for user',
                    HttpStatus.NOT_FOUND,
                );
            }

            return uChapterProgress;
        } catch (error: unknown) {
            console.error(error);
            if (error instanceof HttpException) {
                throw error;
            }

            throw new InternalServerErrorException(`
                Failed to get chapters for user: ${error instanceof Error ? error.message : String(error)}    
            `);
        }
    }

    /**
     * Generate custom roadmap for user based on the user profile
     * @param uuid - user uuid
     * @returns a Promise containing a Chapter
     */
    public async generateCustomRoadmap(uuid: string): Promise<Chapter> {
        try {
            const userProfile = await this.authService.findUserProfile(uuid);

            if (!userProfile) {
                throw new HttpException(
                    'No userprofile found',
                    HttpStatus.NOT_FOUND,
                );
            }

            const roadmapCount = await this.chapterProgressRepository.count({
                where: {
                    user: { uuid: userProfile.uuid },
                },
            });

            if (roadmapCount > 0) {
                throw new HttpException(
                    'User already has a roadmap',
                    HttpStatus.CONFLICT,
                );
            }

            const allChapters = await this.chapterRepository.find({
                order: { created_at: 'ASC' },
                relations: ['lessons'],
            });

            if (!allChapters || allChapters.length === 0) {
                throw new HttpException(
                    'No chapters found in database',
                    HttpStatus.NOT_FOUND,
                );
            }

            const customRoadmap = this.determineRoadmapOrder(
                allChapters,
                userProfile,
            );

            const chapterProgresses = customRoadmap.map((chapter, index) =>
                this.chapterProgressRepository.create({
                    chapter: { uuid: chapter.uuid },
                    user: { uuid },
                    status:
                        index === 0
                            ? EProgressStatus.UNLOCKED
                            : EProgressStatus.LOCKED,
                    order: index + 1,
                }),
            );

            await this.chapterProgressRepository.save(chapterProgresses);

            const firstChapter = customRoadmap[0];
            if (
                firstChapter &&
                firstChapter.lessons &&
                firstChapter.lessons.length > 0
            ) {
                const lessonUserRepo =
                    this.chapterProgressRepository.manager.getRepository(
                        LessonUser,
                    );

                const lessonUserEntries = firstChapter.lessons.map((lesson) => {
                    return lessonUserRepo.create({
                        user: { uuid },
                        lesson: { uuid: lesson.uuid },
                        status:
                            lesson.order === 1
                                ? EProgressStatus.UNLOCKED
                                : EProgressStatus.LOCKED,
                    });
                });

                await lessonUserRepo.save(lessonUserEntries);
            }

            return firstChapter;
        } catch (error: unknown) {
            console.error(error);
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(
                `Failed to generate custom roadmap: ${error instanceof Error ? error.message : String(error)}`,
            );
        }
    }

    public async unlockNewChapter(uuid: string): Promise<boolean> {
        try {
            const currentChapter = await this.chapterProgressRepository.findOne(
                {
                    where: {
                        user: { uuid },
                        status: EProgressStatus.INPROGRESS,
                    },
                },
            );

            if (!currentChapter) {
                throw new HttpException(
                    'No chapter currently in progress',
                    HttpStatus.NOT_FOUND,
                );
            }

            currentChapter.status = EProgressStatus.COMPLETED;
            await this.chapterProgressRepository.save(currentChapter);

            const nextChapter = await this.chapterProgressRepository.findOne({
                where: {
                    user: { uuid },
                    order: currentChapter.order + 1,
                },
                relations: ['chapter', 'user'],
            });

            if (nextChapter && nextChapter.status === EProgressStatus.LOCKED) {
                nextChapter.status = EProgressStatus.UNLOCKED;
                await this.chapterProgressRepository.save(nextChapter);
            }

            return true;
        } catch (error: unknown) {
            console.error(error);
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(
                `Failed to unlock next chapter: ${error instanceof Error ? error.message : String(error)}`,
            );
        }
    }

    /**
     * Bepaalt de volgorde en filtert hoofdstukken op basis van het profiel
     */
    private determineRoadmapOrder(chapters: Chapter[], userProfile: any): Chapter[] {
        const userTags = new Set<string>();
        
        if (userProfile.currentBehaviour) {
            userProfile.currentBehaviour.forEach((tag: string) => userTags.add(tag));
        }
        if (userProfile.experienceLevel) {
            userTags.add(userProfile.experienceLevel);
        }
        if (userProfile.goal) {
            userTags.add(userProfile.goal);
        }
        if (userProfile.currentPreferences) {
            userTags.add(userProfile.currentPreferences);
        }
        if (userProfile.currentMethodes) {
            userProfile.currentMethodes.forEach((tag: string) => userTags.add(tag));
        }
        if (userProfile.extraGear) {
            userProfile.extraGear.forEach((tag: string) => userTags.add(tag));
        }

        console.log('userTags', userTags);

        return chapters
            .map((chapter) => {
                let score = 0;
                
                const chapterTags: string[] = typeof chapter.tags === 'string' 
                    ? JSON.parse(chapter.tags) 
                    : chapter.tags || [];

                chapterTags.forEach((tag) => {
                    if (userTags.has(tag)) {
                        score += 1;
                        
                        if (tag.startsWith('goal_')) {
                            score += 1.5; 
                        }
                    }
                });

                return { chapter, score };
            })
            .sort((a, b) => {
                if (b.score !== a.score) {
                    return b.score - a.score;
                }
                return 0; 
            })
            .map((item) => item.chapter);
    }

    private getHighestPriorityIndex(
        chapterTags: string[],
        preferredOrder: string[],
    ): number {
        for (let i = 0; i < preferredOrder.length; i++) {
            if (chapterTags.includes(preferredOrder[i])) {
                return i;
            }
        }
        return 999;
    }
}
