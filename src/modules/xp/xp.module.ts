import { Module } from '@nestjs/common';
import { XpService } from './xp.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../auth/entity/user.entity';
import { UserStreaks } from '../auth/entity/user_streak.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, UserStreaks])],
    providers: [XpService],
    exports: [XpService],
})
export class XpModule {}
