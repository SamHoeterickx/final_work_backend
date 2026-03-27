import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../../modules/auth/auth.service';
import { TokenService } from '../../shared/token/token.service';
import { GqlExecutionContext } from '@nestjs/graphql';
import { type Request } from 'express';

interface AuthenticatedRequest extends Request {
    user?: unknown;
}

/**
 * Check header for authroziation bearer token
 * Verify if current access token is stil valid
 * Set user to request
 *
 * @returns boolean
 */
@Injectable()
export class GqlAuthGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private tokenService: TokenService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const ctx = GqlExecutionContext.create(context);
        const { req } = ctx.getContext<{ req: AuthenticatedRequest }>();

        const authHeader: string | undefined = req.headers?.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('No token found in headers');
        }

        const token: string = authHeader.split(' ')[1];

        try {
            const payload = this.tokenService.verifyAccessToken(token);
            const user = await this.authService.findOneByUuid(
                payload.sub as string,
            );
            if (!user || !user.currentHashedRefreshToken) {
                throw new HttpException(
                    'Logged out or session expired',
                    HttpStatus.UNAUTHORIZED,
                );
            }

            req.user = user;
            return true;
        } catch (error) {
            throw new UnauthorizedException(
                `Invalid or expired token: ${error instanceof Error ? error.message : String(error)}`,
            );
        }
    }
}
