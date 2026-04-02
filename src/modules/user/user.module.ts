import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { UserProfile } from './entity/user_profile.entity';
import { UserProgress } from './entity/user_progress.entity';
import { TokenService } from 'src/shared/token/token.service';
import { AuthService } from '../auth/auth.service';
import { Lesson } from '../lesson/entity/lesson.entity';
import { ChapterService } from '../chapter/chapter.service';
import { ChapterModule } from '../chapter/chapter.module';
import { Chapter } from '../chapter/entity/chapter.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            User,
            UserProfile,
            UserProgress,
            Lesson,
            Chapter,
        ]),
        ChapterModule,
    ],
    providers: [
        UserResolver,
        UserService,
        TokenService,
        AuthService,
        ChapterService,
    ],
})
export class UserModule {}
