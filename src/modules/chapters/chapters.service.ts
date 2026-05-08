import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chapter } from './entity/chapter.entity';
import { Repository } from 'typeorm';
import { ChapterUser } from './entity/chapter_user.entity';
import { AuthService } from '../auth/auth.service';
import { EProgressStatus } from '../../shared/types/types';

@Injectable()
export class ChaptersService {
    constructor(
        @InjectRepository(Chapter) private chapterRepository: Repository<Chapter>,
        @InjectRepository(ChapterUser) private chapterProgressRepository: Repository<ChapterUser>,
        private authService: AuthService,
    ){}

    /**
     * Get all Chapters for a person
     * @param uuid - user uuid
     * @returns a Promise containing an array of ChapterUser entity
     */
    public async getMyChapters(uuid: string): Promise<ChapterUser[]>{
        try{
            const uProgress = await this.chapterProgressRepository.find({
                where: {
                    user: { uuid }
                },
                relations: ['chapter']
            });

            if(!uProgress || uProgress.length === 0){
                throw new HttpException('No chapters found for user', HttpStatus.NOT_FOUND);
            }

            return uProgress
        }catch(error: unknown){
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
     * Create new chapter progress entries.
     * 
     * @param uuid - user uuid
     * @returns a Promise containing a boolean
     */
    public async createChapterEntries(uuid: string): Promise<boolean> {
        try{
            const chapters = await this.chapterRepository.find();

            if (!chapters || chapters.length === 0) {
                throw new HttpException('Failed to find chapters', HttpStatus.NOT_FOUND);
            }
            
            const chapterProgresses = chapters.map((chapter, index) => 
                this.chapterProgressRepository.create({
                    chapter: { uuid: chapter.uuid },
                    user: { uuid },
                    status: index + 1 === 1 ? EProgressStatus.UNLOCKED : EProgressStatus.LOCKED,
                    order: index + 1,
                })
            );

            await this.chapterProgressRepository.save(chapterProgresses);
            return true;

        }catch(error: unknown) {
            console.error(error);
            if(error instanceof HttpException) {
                throw error
            };
            throw new InternalServerErrorException(
                `Failed to create chapter entries for user: ${error instanceof Error ? error.message : String(error)}`
            );
        }
    }
}
