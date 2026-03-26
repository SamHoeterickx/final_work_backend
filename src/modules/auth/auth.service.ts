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
import bcrypt from 'node_modules/bcryptjs';
import { ConfigService } from '@nestjs/config';
import { IUserTokens } from 'src/shared/types/types';
import { TokenService } from 'src/shared/token/token.service';
import { RefresTokenDto } from './dto/refreshToken.dto';

@Injectable()
export class AuthService {
    private SECRET_SALT: string;

    constructor(
        @InjectRepository(User) private authRepository: Repository<User>,
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
                throw new HttpException(
                    'Invalid credentials',
                    HttpStatus.CONFLICT,
                );
            }

            const match = await this.comparePasswords(password, eUser.password);
            if (!match) {
                throw new HttpException(
                    'Invalid credentials',
                    HttpStatus.CONFLICT,
                );
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
            throw new InternalServerErrorException(
                `Failed to encrypt password: ${error instanceof Error ? error.message : String(error)}`,
            );
        }
    }

    public async createNewUser(body: CreateUserDto): Promise<IUserTokens> {
        const { firstname, lastname, email, password, repeatPassword } = body;

        try {
            if (password !== repeatPassword) {
                throw new HttpException(
                    'Invalid credentials',
                    HttpStatus.CONFLICT,
                );
            }

            const eUser = await this.authRepository.findOne({
                where: {
                    email,
                },
            });

            if (eUser) {
                throw new HttpException(
                    'Invalid credentials',
                    HttpStatus.CONFLICT,
                );
            }

            const hPassword = await this.hashPassword(password);

            const newUser = this.authRepository.create({
                firstname,
                lastname,
                email,
                password: hPassword,
            });

            const user = await this.authRepository.save(newUser);
            const accessToken = this.tokenService.generateAccessToken(
                user.uuid,
            );
            const refreshToken = this.tokenService.generateRefreshToken(
                user.uuid,
            );

            return { accessToken, refreshToken };
        } catch (error: unknown) {
            console.error(error);
            throw new InternalServerErrorException(
                `Failed to encrypt password: ${error instanceof Error ? error.message : String(error)}`,
            );
        }
    }

    public async refreshTokens(body: RefresTokenDto): Promise<IUserTokens> {
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
            const newRefreshToken = this.tokenService.generateAccessToken(
                user.uuid,
            );

            return {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
            };
        } catch (error: unknown) {
            console.error(error);
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
            return bcrypt.hash(password + this.SECRET_SALT, 10);
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
            return bcrypt.compare(password + this.SECRET_SALT, dbPassword);
        } catch (error: unknown) {
            console.error(error);
            throw new Error(
                `Failed to encode password: ${error instanceof Error ? error.message : String(error)}`,
            );
        }
    }
}
