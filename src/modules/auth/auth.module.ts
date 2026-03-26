import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from 'src/shared/shared.module';
import { AuthResolver } from './auth.resolver';
import { TokenService } from 'src/shared/token/token.service';

@Module({
    imports: [TypeOrmModule.forFeature([User]), ConfigModule, SharedModule],
    providers: [AuthService, AuthResolver, TokenService],
})
export class AuthModule {}
