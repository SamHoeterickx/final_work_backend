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
import {
    IUserTokens,
    IOnboardingData,
    ELocales,
} from '../../shared/types/types';
import { TokenService } from '../../shared/token/token.service';
import { RefreshTokenDto } from './dto/refreshToken.dto';
import { UserProfile } from './entity/user_profile.entity';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { ForgotPasswordRequestDto } from './dto/forgotPasswordRequest';
import { ResendService } from '../resend/resend.service';
import { ResetPasswordWithCodeDto } from './dto/resetPasswordWithCode.dto';
import { UserTokens } from './models/user-tokens.model';
import { VerifyPasswordResetCodeDto } from './dto/verifyPasswordResetCode.dto';
import { UserData } from './models/user-data.model';
import { UpdateEmailDto } from './dto/updateEmail.dto';
import { UpdateUsernameDto } from './dto/updateUsername.dto';
import { DeleteUserDto } from './dto/deleteUser.dto';
import { UpdateLanguageDto } from './dto/updateLanguage.dto';
import { XpService } from '../xp/xp.service';
import {
    REGISTRATION_TRANSLATIONS,
    RESET_PASSWORD_TRANSLATIONS,
} from '../../shared/const/mail.const';

@Injectable()
export class AuthService {
    private PEPPER: string;

    constructor(
        @InjectRepository(User) private authRepository: Repository<User>,
        @InjectRepository(UserProfile)
        private userProfileRepository: Repository<UserProfile>,
        private configService: ConfigService,
        private resendService: ResendService,
        private tokenService: TokenService,
        private xpService: XpService,
    ) {
        const SALT = this.configService.get<string>('PEPPER');
        if (!SALT)
            throw new InternalServerErrorException(
                'PEPPER environment is not set',
            );

        this.PEPPER = SALT;
    }

    public async getUserData(uuid: string): Promise<UserData> {
        try {
            const eUser = await this.authRepository.findOne({
                where: { uuid },
                select: {
                    uuid: true,
                    name: true,
                    email: true,
                    xp: true,
                    role: true,
                },
                relations: ['streak'],
            });

            if (!eUser) {
                throw new HttpException('No user found', HttpStatus.NOT_FOUND);
            }

            return {
                name: eUser.name,
                email: eUser.email,
                role: eUser.role,
                xp: eUser.xp,
                streaks: eUser.streak,
            };
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

            return await this.generateNewTokens(eUser.uuid);
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
        const { name, email, password, repeatPassword, language } = body;
        const onboarding = body.onboarding as unknown as IOnboardingData;

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
                        name,
                        email,
                        password: hPassword,
                        language
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

                    await this.xpService.createUserStreaksEntry(
                        savedUser,
                        manager,
                    );

                    const accessToken = this.tokenService.generateAccessToken(
                        savedUser.uuid,
                    );
                    const refreshToken = this.tokenService.generateRefreshToken(
                        savedUser.uuid,
                    );
                    const hRefreshToken =
                        await this.tokenService.hashRefreshToken(refreshToken);

                    await manager.update(User, savedUser.uuid, {
                        currentHashedRefreshToken: hRefreshToken,
                    });

                    return { accessToken, refreshToken, savedUser };
                },
            );

            const uLanguage = result.savedUser.language;
            const content =
                REGISTRATION_TRANSLATIONS[uLanguage] ||
                RESET_PASSWORD_TRANSLATIONS.en;

            await this.resendService.sendEmail({
                reciever: result.savedUser.email,
                subject: content.title,
                message: `
                    <div style="background-color: #E8DFD3; padding: 64px 20px; font-family: Arial, sans-serif; color: #222222; text-align: center; box-sizing: border-box;">
                        <div style="max-width: 550px; margin: 0 auto; line-height: 1.6;">
                            <h2 style="font-size: 32px; margin-top: 0; margin-bottom: 24px;">${content.title}</h2>
                            <p style="font-size: 24px; margin-bottom: 16px; font-weight: bold;">${content.greetings} ${result.savedUser.name},</p>
                            <p style="font-size: 18px; margin-bottom: 0;">${content.description}</p>
                        </div>
                    </div>
                `,
            });

            return {
                accessToken: result.accessToken,
                refreshToken: result.refreshToken,
            };
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

    public async logout(uuid: string) {
        try {
            await this.authRepository.update(
                { uuid: uuid },
                { currentHashedRefreshToken: null },
            );

            return true;
        } catch (error: unknown) {
            console.error(error);
            throw new InternalServerErrorException(
                `Failed to logout user: ${error instanceof Error ? error.message : String(error)}`,
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

            if (!user || !user.currentHashedRefreshToken) {
                throw new HttpException(
                    'Logged out or session expired',
                    HttpStatus.UNAUTHORIZED,
                );
            }

            const isMatch = await compare(
                refreshToken,
                user.currentHashedRefreshToken,
            );
            if (!isMatch) {
                throw new HttpException(
                    'Invalid refresh token',
                    HttpStatus.UNAUTHORIZED,
                );
            }

            return await this.generateNewTokens(user.uuid);
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
     * Find user by uuid
     *
     * @param uuid string
     *
     * @returns
     * a Promise containing User or null or undefined
     *
     * @throws
     */
    public async findOneByUuid(uuid: string): Promise<User | null | undefined> {
        try {
            return await this.authRepository.findOne({ where: { uuid: uuid } });
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

    public async findUserProfile(
        uuid: string,
    ): Promise<UserProfile | null | undefined> {
        try {
            return await this.userProfileRepository.findOne({
                where: { user: { uuid } },
            });
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
     * Reset password with old password
     * @param input
     * - oldPassword: string
     * - newPassword: string
     * - repeatNewPassword: string,
     * @param uuid : uuid of current user
     */
    public async resetPassword(
        input: ResetPasswordDto,
        uuid: string,
    ): Promise<IUserTokens> {
        const { oldPassword, newPassword, repeatNewPassword } = input;
        try {
            if (newPassword !== repeatNewPassword) {
                throw new HttpException(
                    'Passwords do not match',
                    HttpStatus.BAD_REQUEST,
                );
            }

            const eUser = await this.authRepository.findOne({
                where: {
                    uuid: uuid,
                },
            });
            if (!eUser) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }

            const isMatch = await this.comparePasswords(
                oldPassword,
                eUser.password,
            );
            if (!isMatch) {
                throw new HttpException(
                    'Invalid old password',
                    HttpStatus.UNAUTHORIZED,
                );
            }

            const hPassword = await this.hashPassword(newPassword);

            await this.authRepository.update(uuid, {
                password: hPassword,
            });

            return await this.generateNewTokens(eUser.uuid);
        } catch (error: unknown) {
            console.error(error);
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(
                `Failed to reset password: ${error instanceof Error ? error.message : String(error)}`,
            );
        }
    }

    /**
     * Reset password with code when original password is forgotten
     * @param input
     * - email: string
     * - code: string
     * - newPassword: string
     */
    public async resetPasswordWithCode(
        input: ResetPasswordWithCodeDto,
    ): Promise<UserTokens> {
        const { email, resetCode, newPassword, repeatNewPassword } = input;
        try {
            const eUser = await this.authRepository.findOne({
                where: {
                    email,
                },
            });
            if (!eUser) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }

            if (
                resetCode !== eUser.passwordResetCode ||
                !eUser.passwordResetExpires ||
                new Date() > eUser.passwordResetExpires
            ) {
                throw new HttpException(
                    'Invalid or expired reset code',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (newPassword !== repeatNewPassword) {
                throw new HttpException(
                    'Passwords do not match',
                    HttpStatus.BAD_REQUEST,
                );
            }

            const hPassword = await this.hashPassword(newPassword);

            await this.authRepository.update(eUser.uuid, {
                password: hPassword,
                passwordResetCode: null,
                passwordResetExpires: null,
            });

            return await this.generateNewTokens(eUser.uuid);
        } catch (error: unknown) {
            console.error(error);
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(
                `Failed to reset password: ${error instanceof Error ? error.message : String(error)}`,
            );
        }
    }

    /**
     * Request code to generate new password when original password is forgotten
     * @param input
     * - email: string
     */
    public async requestForgotPassword(input: ForgotPasswordRequestDto) {
        const { email } = input;
        try {
            const eUser = await this.authRepository.findOne({
                where: {
                    email,
                },
            });

            if (!eUser) {
                throw new HttpException(
                    'No user found with this email',
                    HttpStatus.NOT_FOUND,
                );
            }

            const gPasswordResetCode = this.generateRequestPasswordCode();

            const expires = new Date();
            expires.setMinutes(expires.getMinutes() + 15); // De code vervalt na 15 minuten

            await this.authRepository.update(eUser.uuid, {
                passwordResetCode: gPasswordResetCode,
                passwordResetExpires: expires,
            });
            console.log(gPasswordResetCode);

            const uLanguage = eUser.language;
            console.log(uLanguage);

            const content =
                RESET_PASSWORD_TRANSLATIONS[uLanguage] ||
                RESET_PASSWORD_TRANSLATIONS.en;

            await this.resendService.sendEmail({
                reciever: eUser.email,
                subject: content.title,
                message: `
                    <div style="background-color: #E8DFD3; padding: 64px 20px; font-family: Arial, sans-serif; color: #222222; text-align: center; box-sizing: border-box;">
                        <div style="max-width: 550px; margin: 0 auto; line-height: 1.5;">
                            <h2 style="font-size: 24px">${content.title}</h2>
                            <p style="font-size: 14px">${content.greetings} ${eUser.name},</p>
                            <p style="font-size: 14px">${content.description}</p>
                            
                            <div style="margin: 32px 0;">
                                <span style="background-color: #465E3C; padding: 24px 48px; display: inline-block; letter-spacing: 12px; font-size: 24px; border-radius: 9999px; color: #ffffff; font-weight: bold;">
                                    ${gPasswordResetCode}
                                </span>
                            </div>
                            
                            <p>${content.lowerInfo}</p>
                        </div>
                    </div>
                `,
            });

            return 'Request send';
        } catch (error: unknown) {
            console.error(error);
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(
                `Failed to request forgot password: ${error instanceof Error ? error.message : String(error)}`,
            );
        }
    }

    public async verifyPasswordResetCode(
        input: VerifyPasswordResetCodeDto,
    ): Promise<boolean> {
        const { email, resetCode } = input;
        try {
            const eUser = await this.authRepository.findOne({
                where: {
                    email,
                },
            });
            if (!eUser) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }

            if (
                resetCode !== eUser.passwordResetCode ||
                !eUser.passwordResetExpires ||
                new Date() > eUser.passwordResetExpires
            ) {
                throw new HttpException(
                    'Invalid or expired reset code',
                    HttpStatus.BAD_REQUEST,
                );
            }

            return true;
        } catch (error: unknown) {
            console.error(error);
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(
                `Failed to request forgot password: ${error instanceof Error ? error.message : String(error)}`,
            );
        }
    }

    public async updateEmail(
        user: User,
        input: UpdateEmailDto,
    ): Promise<boolean> {
        try {
            const { updatedEmailAdress } = input;

            const eUserWithEmail = await this.authRepository.findOne({
                where: {
                    email: updatedEmailAdress,
                },
            });

            if (eUserWithEmail) {
                throw new HttpException(
                    'Email is already in use',
                    HttpStatus.CONFLICT,
                );
            }

            const uUser = await this.authRepository.update(user.uuid, {
                email: updatedEmailAdress,
            });

            if (uUser.affected === 0) {
                throw new InternalServerErrorException(
                    `Failed to update email`,
                );
            }

            return true;
        } catch (error: unknown) {
            console.error(error);
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(
                `Failed to update email: ${error instanceof Error ? error.message : String(error)}`,
            );
        }
    }

    public async updateUserName(
        user: User,
        input: UpdateUsernameDto,
    ): Promise<boolean> {
        try {
            const { updatedUsername } = input;
            const uUser = await this.authRepository.update(user.uuid, {
                name: updatedUsername,
            });

            if (uUser.affected === 0) {
                throw new InternalServerErrorException(
                    `Failed to update username`,
                );
            }

            return true;
        } catch (error: unknown) {
            console.error(error);
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(
                `Failed to update username: ${error instanceof Error ? error.message : String(error)}`,
            );
        }
    }

    public async deleteUser(
        uuid: string,
        input: DeleteUserDto,
    ): Promise<boolean> {
        try {
            const { password } = input;

            const dbUser = await this.authRepository.findOne({
                where: { uuid },
            });
            if (!dbUser)
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);

            const isMatch = await this.comparePasswords(
                password,
                dbUser.password,
            );
            if (isMatch) {
                await this.authRepository.delete(uuid);
                return true;
            }

            throw new HttpException('Invalid credentials', 409);
        } catch (error: unknown) {
            console.error(error);
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(
                `Failed to delete user: ${error instanceof Error ? error.message : String(error)}`,
            );
        }
    }

    public async updatePrefenceLanguage(
        userUuid: string,
        locale: UpdateLanguageDto,
    ): Promise<boolean> {
        try {
            await this.authRepository.update(userUuid, {
                language: locale.language,
            });

            return true;
        } catch (error: unknown) {
            console.error(error);
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(
                `Failed to update preference language for user: ${error instanceof Error ? error.message : String(error)}`,
            );
        }
    }

    public async getPreferenceLanguage(userUuid: string): Promise<ELocales> {
        try {
            const eUser = await this.authRepository.findOne({
                where: { uuid: userUuid },
                select: { language: true },
            });

            if (!eUser) {
                throw new HttpException('No user found', HttpStatus.NOT_FOUND);
            }

            return eUser.language;
        } catch (error: unknown) {
            console.error(error);
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(
                `Failed to update preference language for user: ${error instanceof Error ? error.message : String(error)}`,
            );
        }
    }

    private generateRequestPasswordCode(): string {
        const code: number[] = [];
        for (let i = 0; i < 8; i++) {
            const nEntry = Math.floor(Math.random() * 10);
            code.push(nEntry);
        }
        return code.join('');
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
            return hash(password + this.PEPPER, 10);
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
            return compare(password + this.PEPPER, dbPassword);
        } catch (error: unknown) {
            console.error(error);
            throw new Error(
                `Failed to encode password: ${error instanceof Error ? error.message : String(error)}`,
            );
        }
    }

    /**
     * Generate new JWT access token and JWT refresh token,
     * hash the new JWT refresh token and save this hashed token in the database
     *
     * @param uuid - string
     *
     * @returns
     * a Promise with an object containing
     * - accessToken: string
     * - refreshToken: string
     *
     * @throws Error
     */
    private async generateNewTokens(uuid: string): Promise<IUserTokens> {
        try {
            const accessToken = this.tokenService.generateAccessToken(uuid);
            const refreshToken = this.tokenService.generateRefreshToken(uuid);
            const hRefreshToken =
                await this.tokenService.hashRefreshToken(refreshToken);

            await this.authRepository.update(
                { uuid },
                {
                    currentHashedRefreshToken: hRefreshToken,
                },
            );

            return { accessToken, refreshToken };
        } catch (error: unknown) {
            console.error(error);
            throw new Error(
                `Failed to generate new tokens: ${error instanceof Error ? error.message : String(error)}`,
            );
        }
    }
}
