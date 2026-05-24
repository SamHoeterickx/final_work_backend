import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { ConfigModule } from '@nestjs/config';
import { AuthResolver } from './auth.resolver';
import { TokenService } from '../../shared/token/token.service';
import { UserProfile } from './entity/user_profile.entity';
import { ResendService } from '../resend/resend.service';
import { XpModule } from '../xp/xp.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, UserProfile]),
        ConfigModule,
        XpModule,
    ],
    providers: [AuthService, AuthResolver, TokenService, ResendService],
    exports: [AuthService],
})
export class AuthModule {}
