import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/entity/user.entity';
import { Repository } from 'typeorm';
import { UserStreaks } from '../auth/entity/user_streak.entity';

@Injectable()
export class XpService {
    private readonly FIRST_STREAK_AMOUNT = 3;
    private readonly SECOND_STREAK_AMOUNT = 5;

    private readonly FIRST_STREAK_MULTIPLIER = 1.25;
    private readonly SECOND_STREAK_MULTIPLIER = 1.5;

    private readonly CHAPTER_MULTIPLIER = 50;

    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(UserStreaks) private streakRepository: Repository<UserStreaks>,
    ){}

    private calculateByStreaksXP(streaks: number, earnedXp: number): number {
        if (streaks >= this.SECOND_STREAK_AMOUNT) {
            return earnedXp * this.SECOND_STREAK_MULTIPLIER;
        }

        if (streaks >= this.FIRST_STREAK_AMOUNT) {
            return earnedXp * this.FIRST_STREAK_MULTIPLIER;
        }

        return earnedXp;
    }

    private calculateByChapterXP(amountOfLessonsInChapter: number): number {
        return amountOfLessonsInChapter * this.CHAPTER_MULTIPLIER;
    }

    public async updateUserXP(uuid: string, earnedXP: number, isLastLesson: boolean, amountOfLessonsInChapter: number){
        try{
            const user = await this.userRepository.findOne({ 
                where: { uuid },
                relations: ['streak']
            });
            if (!user) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }

            const updatedStreak = await this.handleStreakUpdate(user);

            let multipliedXP = this.calculateByStreaksXP(updatedStreak.currentStreak, earnedXP);

            if(isLastLesson){
                const chapterMultipliedXP = this.calculateByChapterXP(amountOfLessonsInChapter);
                multipliedXP = multipliedXP + chapterMultipliedXP;
            }
            
            const newXp = Math.round(user.xp + multipliedXP);
            const eUser = await this.userRepository.update(uuid, { xp: newXp });
            
            if (eUser.affected === 0) {
                throw new InternalServerErrorException('Failed to update xp');
            }
        } catch (error: unknown) {
            console.error(error);
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(
                `Failed update xp: ${error instanceof Error ? error.message : String(error)}`,
            );
        }
    }

    private async handleStreakUpdate(user: User): Promise<UserStreaks> {
        let streak = user.streak;

        if (!streak) {
            streak = this.streakRepository.create({
                user: user,
                currentStreak: 0,
                longestStreak: 0,
                lastCompletedDate: null
            });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (!streak.lastCompletedDate) {
            streak.currentStreak = 1;
            streak.lastCompletedDate = today;
        } else {
            const lastDate = new Date(streak.lastCompletedDate);
            lastDate.setHours(0, 0, 0, 0);

            const diffTime = today.getTime() - lastDate.getTime();
            const diffDays = Math.round(diffTime / (1000 * 3600 * 24));

            if (diffDays === 1) {
                streak.currentStreak += 1;
                streak.lastCompletedDate = today;
            } else if (diffDays > 1) {
                streak.currentStreak = 1;
                streak.lastCompletedDate = today;
            }
        }

        if (streak.currentStreak > streak.longestStreak) {
            streak.longestStreak = streak.currentStreak;
        }

        return await this.streakRepository.save(streak);
    }

}
