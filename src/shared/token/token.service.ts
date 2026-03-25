import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import jwt, { JwtPayload } from "jsonwebtoken";

@Injectable()
export class TokenService {
    private JWT_SIGN_SECRET: string;
    private JWT_REFRESH_SECRET: string;
    constructor(private configService: ConfigService) {
        const signSecret = this.configService.get<string>('JWT_SIGN_SECRET');
        const refreshSecret =
            this.configService.get<string>('JWT_REFRESH_SECRET');

        if (!signSecret)
            throw new InternalServerErrorException(
                'JWT_SIGN_SECRET environment is not set',
            );
        if (!refreshSecret)
            throw new InternalServerErrorException(
                'JWT_REFRESH_SECRET environment is not set',
            );

        this.JWT_SIGN_SECRET = signSecret;
        this.JWT_REFRESH_SECRET = refreshSecret;
    }

    public generateAccessToken(userId: string): string {
        return jwt.sign({ sub: userId }, this.JWT_SIGN_SECRET, {
            expiresIn: '15m',
        });
    }

    public generateRefreshToken(userId: string): string {
        return jwt.sign({ sub: userId }, this.JWT_REFRESH_SECRET, {
            expiresIn: '7d',
        });
    }

    public verifyRefreshToken(token: string): JwtPayload | string {
        return jwt.verify(token, this.JWT_REFRESH_SECRET);
    }
}
