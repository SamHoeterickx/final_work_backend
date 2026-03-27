import {
    HttpException,
    HttpStatus,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { LoginUserDto } from './dto/loginUser.dto';
import { hash, compare } from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { IOnboardingData, IUserTokens } from '../../shared/types/types';
import { TokenService } from '../../shared/token/token.service';
import { RefreshTokenDto } from './dto/refreshToken.dto';
import { UserProfile } from './entity/user_profile.entity';
import { OnboardingInput } from './dto/OnboardingInput.dto';

@Injectable()
export class AuthService {
    private SECRET_SALT: string;

    constructor(
        @InjectRepository(User) private authRepository: Repository<User>,
        @InjectRepository(UserProfile)
        private UserProfileRepository: Repository<UserProfile>,
        private configService: ConfigService,
        private tokenService: TokenService,
    ) {
        const SALT = this.configService.get<string>('SECRET_SALT');
        if (!SALT)
            throw new InternalServerErrorException(
                'SECRET_SALT environment is not set',
            );

        this.SECRET_SALT = SALT;
    }

    public async loginUser(body: LoginUserDto): Promise<IUserTokens> {
        const { email, password } = body;
        try {
            const eUser = await this.authRepository.findOne({
                where: { email },
            });

            if (!eUser) {
                throw new HttpException('Invalid credentials', 409);
            }

            const match = await this.comparePasswords(password, eUser.password);
            if (!match) {
                throw new HttpException('Invalid credentials', 409);
            }

            const accessToken = this.tokenService.generateAccessToken(
                eUser.uuid,
            );
            const refreshToken = this.tokenService.generateRefreshToken(
                eUser.uuid,
            );

            return { accessToken, refreshToken };
        } catch (error: unknown) {
            console.error(error);
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(
                `Failed to encrypt password: ${error instanceof Error ? error.message : String(error)}`,
            );
        }
    }

    public async createNewUser(body: CreateUserDto): Promise<IUserTokens> {
        const { firstname, email, password, repeatPassword, onboarding } = body;

        try {
            if (password !== repeatPassword) {
                throw new HttpException('Invalid credentials', 409);
            }

            const eUser = await this.authRepository.findOne({
                where: {
                    email,
                },
            });

            if (eUser) {
                throw new HttpException('Invalid credentials', 409);
            }

            const hPassword = await this.hashPassword(password);

            const result = await this.authRepository.manager.transaction(
                async (manager) => {
                    const newUser = manager.create(User, {
                        firstname,
                        email,
                        password: hPassword,
                    });
                    const savedUser = await manager.save(newUser);

                    const newProfile = Object.assign(new UserProfile(), {
                        currentBehaviour: onboarding.currentBehaviour,
                        experienceLevel: onboarding.experienceLevel,
                        goal: onboarding.goal,
                        currentPreference: onboarding.currentPreferences,
                        desiredTempo: onboarding.desiredTempo,
                        currentMethodes: onboarding.currentMethodes ?? null,
                        extraGear: onboarding.extraGear ?? null,
                        fullOnboardingData: onboarding,
                        user: savedUser,
                    });
                    await manager.save(newProfile);

                    const accessToken = this.tokenService.generateAccessToken(
                        savedUser.uuid,
                    );
                    const refreshToken = this.tokenService.generateRefreshToken(
                        savedUser.uuid,
                    );
                    const hRefreshToken =
                        await this.hashRefreshToken(refreshToken);

                    await manager.update(User, savedUser.uuid, {
                        currentHashedRefreshToken: hRefreshToken,
                    });

                    return { accessToken, refreshToken };
                },
            );

            return result;
        } catch (error: unknown) {
            console.error(error);
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(
                `Failed to create user: ${error instanceof Error ? error.message : String(error)}`,
            );
        }
    }

    /**
     * Check if JWT refresh token is still valid or is revoked
     * when the token is still valid generate new access token and refresh token
     *
     * @param refreshToken - string
     *
     * @returns
     * a Promise with new jwt access token and jwt refresh token
     *
     * @throws HttpException unauthorized
     */
    public async refreshTokens(body: RefreshTokenDto): Promise<IUserTokens> {
        const { refreshToken } = body;
        try {
            const payload = this.tokenService.verifyRefreshToken(refreshToken);
            const user = await this.authRepository.findOne({
                where: { uuid: payload.sub as string },
            });

            if (!user) {
                throw new HttpException(
                    'User no longer exists',
                    HttpStatus.UNAUTHORIZED,
                );
            }
            const newAccessToken = this.tokenService.generateAccessToken(
                user.uuid,
            );
            const newRefreshToken = this.tokenService.generateRefreshToken(
                user.uuid,
            );

            return {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
            };
        } catch (error: unknown) {
            console.error(error);
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                'Invalid or expired refresh token',
                HttpStatus.UNAUTHORIZED,
            );
        }
    }

    /**
     * Hash password using bcrypt and secret salt
     *
     * @param password - string
     *
     * @returns
     * a Promise containing a string that is the hashed password
     */
    private hashPassword(password: string): Promise<string> {
        try {
            return hash(password + this.SECRET_SALT, 10);
        } catch (error: unknown) {
            console.error(error);
            throw new Error(
                `Failed to encrypt password: ${error instanceof Error ? error.message : String(error)}`,
            );
        }
    }

    /**
     * Compare database password with input password
     *
     * @param password - string
     * @param dbPassword - string
     *
     * @returns
     * a Promise of a boolean
     */
    private comparePasswords(
        password: string,
        dbPassword: string,
    ): Promise<boolean> {
        try {
            return compare(password + this.SECRET_SALT, dbPassword);
        } catch (error: unknown) {
            console.error(error);
            throw new Error(
                `Failed to encode password: ${error instanceof Error ? error.message : String(error)}`,
            );
        }
    }

    private async hashRefreshToken(refreshToken: string): Promise<string> {
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
