import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { sign, verify, type JwtPayload } from 'jsonwebtoken';
import { hash } from 'bcryptjs';

@Injectable()
export class TokenService {
    private JWT_ACCESS_SECRET: string;
    private JWT_REFRESH_SECRET: string;
    constructor(private configService: ConfigService) {
        const signSecret = this.configService.get<string>('JWT_ACCESS_SECRET');
        const refreshSecret =
            this.configService.get<string>('JWT_REFRESH_SECRET');

        if (!signSecret)
            throw new InternalServerErrorException(
                'JWT_ACCESS_SECRET environment is not set',
            );
        if (!refreshSecret)
            throw new InternalServerErrorException(
                'JWT_REFRESH_SECRET environment is not set',
            );

        this.JWT_ACCESS_SECRET = signSecret;
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
        return sign({ sub: userId }, this.JWT_ACCESS_SECRET, {
            algorithm: 'HS256',
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
            algorithm: 'HS256',
            expiresIn: '7d',
        });
    }

    /**
     * Verify access token to see if token is still valid or token is revoked
     *
     * @param token - string
     *
     * @returns JwtPayload or string
     */
    public verifyAccessToken(token: string): JwtPayload | string {
        return verify(token, this.JWT_ACCESS_SECRET);
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
