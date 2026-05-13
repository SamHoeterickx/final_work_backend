import { Module } from '@nestjs/common';
import { XpService } from './xp.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../auth/entity/user.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([User])
    ],
    providers: [XpService]
})
export class XpModule {}
