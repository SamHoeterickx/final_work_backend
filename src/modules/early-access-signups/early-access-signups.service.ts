import { HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EarlyAccessSignups } from './entity/EarlyAccessSignup.entity';
import { EarlySubscribeDto } from './dto/earlySubscribe.dto';

@Injectable()
export class EarlyAccessSignupsService {
    constructor(
        @InjectRepository(EarlyAccessSignups) private earlyAccessSignupsRepository: Repository<EarlyAccessSignups>,
    ) {}

    async getCount(): Promise<number> {
        try {
            return await this.earlyAccessSignupsRepository.count();
        } catch (error: unknown) {
            console.error(error);
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(
                `Failed to get early signup count: ${error instanceof Error ? error.message : String(error)}`,
            );
        }
    }

    async subscribe(input: EarlySubscribeDto): Promise<boolean> {
        try {
            const nSubscriber = this.earlyAccessSignupsRepository.create({
                email: input.email,
                platform: input.platform
            });

            await this.earlyAccessSignupsRepository.save(nSubscriber);

            return true
        } catch (error: unknown) {
            console.error(error);
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(
                `Failed to get early signup count: ${error instanceof Error ? error.message : String(error)}`,
            );
        }
    }
}
