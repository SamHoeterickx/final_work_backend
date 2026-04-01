import { Module } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { LessonResolver } from './lesson.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lesson } from './entity/lesson.entity';
import { AuthModule } from '../auth/auth.module';
import { TokenService } from 'src/shared/token/token.service';
import { AuthService } from '../auth/auth.service';
import { User } from '../user/entity/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Lesson, User]), AuthModule],
    providers: [LessonService, LessonResolver, TokenService, AuthService],
})
export class LessonModule {}
