import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chapter } from './entity/chapter.entity';
import { Repository } from 'typeorm';
import { ChapterUser } from './entity/chapter_user.entity';
import { EProgressStatus } from '../../shared/types/types';
import { LessonUser } from '../lessons/entity/lesson_user.entity';
import { AuthService } from '../auth/auth.service';
import { LessonsService } from '../lessons/lessons.service';

@Injectable()
export class ChaptersService {
    constructor(
        @InjectRepository(Chapter) private chapterRepository: Repository<Chapter>,
        @InjectRepository(ChapterUser) private chapterProgressRepository: Repository<ChapterUser>,
        private authService: AuthService,
        private lessonsService: LessonsService
    ){}

    /**
     * Get all Chapters for a person
     * @param uuid - user uuid
     * @returns a Promise containing an array of ChapterUser entity
     */
    public async getMyChapters(uuid: string): Promise<ChapterUser[]>{
        try {
            const uChapterProgress = await this.chapterProgressRepository.find({
                where: { user: { uuid } },
                relations: ['chapter', 'chapter.lessons'],
                order: { 
                    order: 'ASC',
                    chapter: {
                        lessons: {
                            order: 'ASC'
                        }
                    }
                }
            });

            if (!uChapterProgress || uChapterProgress.length === 0) {
                throw new HttpException('No chapters found for user', HttpStatus.NOT_FOUND);
            }

            return uChapterProgress;
        } catch(error: unknown) {
            console.error(error);
            if(error instanceof HttpException){
                throw error;
            }

            throw new InternalServerErrorException(`
                Failed to get chapters for user: ${error instanceof Error ? error.message : String(error)}    
            `);
        }
    }

    /**
     * Generate custom roadmap for user based on the user profile
     * * @param uuid - user uuid
     * @returns a Promise containing a boolean
     */
    public async generateCustomRoadmap(uuid: string): Promise<boolean> {
        try {
            const userProfile = await this.authService.findUserProfile(uuid);
            
            const allChapters = await this.chapterRepository.find({
                order: { created_at: 'ASC' },
                relations: ['lessons'],
            });

            if (!allChapters || allChapters.length === 0) {
                throw new HttpException('No chapters found in database', HttpStatus.NOT_FOUND);
            }

            const customRoadmap = this.determineRoadmapOrder(allChapters, userProfile);

            const chapterProgresses = customRoadmap.map((chapter, index) => 
                this.chapterProgressRepository.create({
                    chapter: { uuid: chapter.uuid },
                    user: { uuid },
                    status: index === 0 ? EProgressStatus.UNLOCKED : EProgressStatus.LOCKED,
                    order: index + 1,
                })
            );

            await this.chapterProgressRepository.save(chapterProgresses);

            // Add entries for lesson_user for the chapter with order 1
            const firstChapter = customRoadmap[0];
            if (firstChapter && firstChapter.lessons && firstChapter.lessons.length > 0) {
                const lessonUserRepo = this.chapterProgressRepository.manager.getRepository(LessonUser);
                
                const lessonUserEntries = firstChapter.lessons.map(lesson => {
                    return lessonUserRepo.create({
                        user: { uuid },
                        lesson: { uuid: lesson.uuid },
                        status: lesson.order === 1 ? EProgressStatus.UNLOCKED : EProgressStatus.LOCKED
                    });
                });

                await lessonUserRepo.save(lessonUserEntries);
            }

            return true;

        } catch(error: unknown) {
            console.error(error);
            if(error instanceof HttpException){
                throw error;
            };
            throw new InternalServerErrorException(
                `Failed to generate custom roadmap: ${error instanceof Error ? error.message : String(error)}`
            );
        }
    }

    public async unlockNewChapter(uuid: string): Promise<boolean> {
        try{
            const currentChapter = await this.chapterProgressRepository.findOne({
                where: { 
                    user: { uuid }, 
                    status: EProgressStatus.INPROGRESS 
                },
            });

            if (!currentChapter) {
                throw new HttpException('No chapter currently in progress', HttpStatus.NOT_FOUND);
            }

            currentChapter.status = EProgressStatus.COMPLETED;
            await this.chapterProgressRepository.save(currentChapter);

            const nextChapter = await this.chapterProgressRepository.findOne({
                where: { 
                    user: { uuid }, 
                    order: currentChapter.order + 1 
                },
                relations: ['chapter', 'user']
            });

            if (nextChapter && nextChapter.status === EProgressStatus.LOCKED) {
                nextChapter.status = EProgressStatus.UNLOCKED;
                await this.chapterProgressRepository.save(nextChapter);
            }

            return true;
        } catch(error: unknown) {
            console.error(error);
            if(error instanceof HttpException){
                throw error;
            };
            throw new InternalServerErrorException(
                `Failed to unlock next chapter: ${error instanceof Error ? error.message : String(error)}`
            );
        }
    }

    /**
     * Bepaalt de volgorde en filtert hoofdstukken op basis van het profiel
     */
    private determineRoadmapOrder(chapters: Chapter[], userProfile: any): Chapter[] {
        let availableChapters = [...chapters];

        // ---------------------------------------------------------
        // REGEL 1: FILTER OP ERVARING (experienceLevel)
        // ---------------------------------------------------------
        const exp = userProfile.experienceLevel?.toLowerCase();
        
        if (exp === 'taste_enjoyer' || exp === 'curious') {
            availableChapters = availableChapters.filter(chapter => 
                !chapter.tags.includes('ADVANCED')
            );
        }

        // ---------------------------------------------------------
        // REGEL 2: PRIORITEIT OP BASIS VAN DOEL (goal)
        // ---------------------------------------------------------
        let preferredTagOrder: string[] = ['BASICS']; 
        const goal = userProfile.goal?.toLowerCase();
        
        switch (goal) {
            case 'bean_to_cup':
                // Wil alles weten over de hele keten
                preferredTagOrder.push('BIOLOGY', 'ORIGINS', 'ROASTING', 'BREWING', 'CHEMISTRY', 'HISTORY', 'ETHICS');
                break;
            case 'perfect_espresso':
                // Focus op hardware en de wetenschap van extractie
                preferredTagOrder.push('EQUIPMENT', 'BREWING', 'CHEMISTRY', 'ROASTING');
                break;
            case 'tasting_skills':
                // Focus op smaken, herkomst en het brandproces
                preferredTagOrder.push('ORIGINS', 'ROASTING', 'BIOLOGY', 'BREWING');
                break;
            case 'latte_art':
                // Vooral praktisch: melk opschuimen, schenken en apparatuur
                preferredTagOrder.push('EQUIPMENT', 'BREWING');
                break;
            default:
                preferredTagOrder.push('BIOLOGY', 'BREWING', 'ORIGINS', 'HISTORY');
        }

        // ---------------------------------------------------------
        // REGEL 3: TWEAKEN OP BASIS VAN SMAAK (currentPreferences)
        // ---------------------------------------------------------
        const pref = userProfile.currentPreferences?.toLowerCase();
        
        if (pref === 'fruity_acidic') {
            preferredTagOrder.unshift('ORIGINS'); 
        } 
        else if (pref === 'bold_classic') {
            preferredTagOrder.unshift('ROASTING');
        }

        // ---------------------------------------------------------
        // SORTEREN VAN DE LIJST
        // ---------------------------------------------------------
        availableChapters.sort((a, b) => {
            const indexA = this.getHighestPriorityIndex(a.tags, preferredTagOrder);
            const indexB = this.getHighestPriorityIndex(b.tags, preferredTagOrder);
            
            if (indexA === indexB) {
                return a.created_at.getTime() - b.created_at.getTime();
            }
            return indexA - indexB;
        });

        return availableChapters;
    }

    private getHighestPriorityIndex(chapterTags: string[], preferredOrder: string[]): number {
        for (let i = 0; i < preferredOrder.length; i++) {
            if (chapterTags.includes(preferredOrder[i])) {
                return i;
            }
        }
        return 999;
    }
}
