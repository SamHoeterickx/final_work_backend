import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/loginUser.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { type Response } from 'express';
import { IUserTokens } from 'src/shared/types/types';
import { RefresTokenDto } from './dto/refreshToken.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('login')
    @HttpCode(200)
    public async loginUser(@Body() body: LoginUserDto): Promise<IUserTokens> {
        return this.authService.loginUser(body);
    }

    @Post('register')
    @HttpCode(201)
    public async registerUser(
        @Body() body: CreateUserDto,
        @Res() res: Response,
    ): Promise<IUserTokens> {
        return this.authService.createNewUser(body);
    }

    @Post('refresh')
    @HttpCode(201)
    public async refreshTokens(@Body() body: RefresTokenDto): Promise<IUserTokens> {
        return this.authService.refreshTokens(body);
    }
}
