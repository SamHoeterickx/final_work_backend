import { Module } from '@nestjs/common';
import { EarlyAccessSignupsResolver } from './early-access-signups.resolver';
import { EarlyAccessSignupsService } from './early-access-signups.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EarlyAccessSignups } from './entity/EarlyAccessSignup.entity';
import { ResendService } from '../resend/resend.service';

@Module({
    imports: [ TypeOrmModule.forFeature([EarlyAccessSignups])],
    providers: [EarlyAccessSignupsResolver, EarlyAccessSignupsService, ResendService],
})
export class EarlyAccessSignupsModule {}
