import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from '../../shared/shared.module';
import { AuthResolver } from './auth.resolver';
import { TokenService } from '../../shared/token/token.service';
import { UserProfile } from './entity/user_profile.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, UserProfile]), ConfigModule, SharedModule],
    providers: [AuthService, AuthResolver, TokenService],
})
export class AuthModule {}
