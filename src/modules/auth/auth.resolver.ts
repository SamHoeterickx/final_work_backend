import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/loginUser.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { RefreshTokenDto } from './dto/refreshToken.dto';
import { UserTokens } from './models/user-tokens.model';
import { CurrentUser } from '../../shared/decorators/currentUser.decorator';
import { User } from './entity/user.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../shared/guards/gqlAuth.guard';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { ForgotPasswordRequestDto } from './dto/forgotPasswordRequest';
import { ResetPasswordWithCodeDto } from './dto/resetPasswordWithCode.dto';
import { VerifyPasswordResetCodeDto } from './dto/verifyPasswordResetCode.dto';
import { UserData } from './models/user-data.model';
import { UpdateEmailDto } from './dto/updateEmail.dto';
import { UpdateUsernameDto } from './dto/updateUsername.dto';
import { DeleteUserDto } from './dto/deleteUser.dto';
import { UpdateLanguageDto } from './dto/updateLanguage.dto';
import { ELocales } from '../../shared/types/types';

@Resolver()
export class AuthResolver {
    constructor(private authService: AuthService) {}

    @Query(() => String)
    public healthCheck(): string {
        return 'OK';
    }

    @Query(() => UserData)
    @UseGuards(GqlAuthGuard)
    public async getUserData(@CurrentUser() user: User): Promise<UserData> {
        return await this.authService.getUserData(user.uuid);
    }

    @Query(() => ELocales)
    @UseGuards(GqlAuthGuard)
    public async getPreferenceLanguage(
        @CurrentUser() user: User,
    ): Promise<ELocales> {
        return await this.authService.getPreferenceLanguage(user.uuid);
    }

    @Mutation(() => UserTokens)
    public async loginUser(
        @Args('input') input: LoginUserDto,
    ): Promise<UserTokens> {
        return this.authService.loginUser(input);
    }

    @Mutation(() => UserTokens)
    public async registerUser(
        @Args('input') input: CreateUserDto,
    ): Promise<UserTokens> {
        return this.authService.createNewUser(input);
    }

    @Mutation(() => UserTokens)
    public async refreshTokens(
        @Args('input') input: RefreshTokenDto,
    ): Promise<UserTokens> {
        return this.authService.refreshTokens(input);
    }

    @Mutation(() => Boolean)
    @UseGuards(GqlAuthGuard)
    public async logOut(@CurrentUser() user: User): Promise<boolean> {
        return this.authService.logout(user.uuid);
    }

    @Mutation(() => Boolean)
    @UseGuards(GqlAuthGuard)
    public async updateEmail(
        @CurrentUser() user: User,
        @Args('input') input: UpdateEmailDto,
    ): Promise<boolean> {
        return await this.authService.updateEmail(user, input);
    }

    @Mutation(() => Boolean)
    @UseGuards(GqlAuthGuard)
    public async updateUserName(
        @CurrentUser() user: User,
        @Args('input') input: UpdateUsernameDto,
    ): Promise<boolean> {
        return await this.authService.updateUserName(user, input);
    }

    @Mutation(() => UserTokens)
    @UseGuards(GqlAuthGuard)
    public async resetPassword(
        @CurrentUser() user: User,
        @Args('input') input: ResetPasswordDto,
    ): Promise<UserTokens> {
        return await this.authService.resetPassword(input, user.uuid);
    }

    @Mutation(() => String)
    public async forgotPasswordRequest(
        @Args('input') input: ForgotPasswordRequestDto,
    ) {
        return this.authService.requestForgotPassword(input);
    }

    @Mutation(() => Boolean)
    public async verifyPasswordResetCode(
        @Args('input') input: VerifyPasswordResetCodeDto,
    ) {
        return await this.authService.verifyPasswordResetCode(input);
    }

    @Mutation(() => UserTokens)
    public async resetPasswordWithCode(
        @Args('input') input: ResetPasswordWithCodeDto,
    ): Promise<UserTokens> {
        return await this.authService.resetPasswordWithCode(input);
    }

    @Mutation(() => Boolean)
    @UseGuards(GqlAuthGuard)
    public async deleteUser(
        @CurrentUser() user: User,
        @Args('input') input: DeleteUserDto,
    ): Promise<boolean> {
        return await this.authService.deleteUser(user.uuid, input);
    }

    @Mutation(() => Boolean)
    @UseGuards(GqlAuthGuard)
    public async updatePreferenceLanguage(
        @CurrentUser() user: User,
        @Args('input') input: UpdateLanguageDto,
    ): Promise<boolean> {
        console.log(input);
        return await this.authService.updatePrefenceLanguage(user.uuid, input);
    }
}
