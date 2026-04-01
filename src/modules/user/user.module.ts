import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { UserProfile } from './entity/user_profile.entity';
import { UserProgress } from './entity/user_progress.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, UserProfile, UserProgress])],
    providers: [UserResolver, UserService],
})
export class UserModule {}
