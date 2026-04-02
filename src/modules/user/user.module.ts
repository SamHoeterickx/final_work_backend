import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { UserProfile } from './entity/user_profile.entity';
import { UserProgress } from './entity/user_progress.entity';
import { TokenService } from 'src/shared/token/token.service';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';

@Module({
    imports: [TypeOrmModule.forFeature([User, UserProfile, UserProgress])],
    providers: [UserResolver, UserService, TokenService, AuthService],
})
export class UserModule {}
