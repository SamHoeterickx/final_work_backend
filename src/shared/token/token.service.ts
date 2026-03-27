import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { sign, verify, type JwtPayload } from 'jsonwebtoken';
import { hash } from 'bcryptjs';

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

    /**
     * Generate new access token that expires in 15 minutes
     *
     * @param userId - string
     *
     * @returns string (jwt token)
     */
    public generateAccessToken(userId: string): string {
        return sign({ sub: userId }, this.JWT_SIGN_SECRET, {
            expiresIn: '15m',
        });
    }

    /**
     * Generate new refresh token that expires in 7 days
     *
     * @param userId - string
     *
     * @returns string (jwt token)
     */
    public generateRefreshToken(userId: string): string {
        return sign({ sub: userId }, this.JWT_REFRESH_SECRET, {
            expiresIn: '7d',
        });
    }

    /**
     * Verify refresh token to see if token is still valid or token is revoked
     *
     * @param token - string
     *
     * @returns JwtPayload or string
     */
    public verifyRefreshToken(token: string): JwtPayload | string {
        return verify(token, this.JWT_REFRESH_SECRET);
    }

    /**
     * Hash refresh token using bcyrpt
     * 
     * @param refreshToken - string
     * 
     * @returns
     * a Promise containing a string
     * 
     * @throws Error
     */
    public async hashRefreshToken(refreshToken: string): Promise<string> {
        try {
            return await hash(refreshToken, 10);
        } catch (error: unknown) {
            console.error(error);
            throw new Error(
                `Failed to hash refreshToken: ${error instanceof Error ? error.message : String(error)}`,
            );
        }
    }
}
