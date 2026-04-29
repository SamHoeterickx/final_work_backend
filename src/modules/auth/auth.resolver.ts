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

@Resolver()
export class AuthResolver {
    constructor(private authService: AuthService) {}

    @Query(() => String)
    public healthCheck(): string {
        return 'OK';
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

    @Mutation(() => UserTokens)
    @UseGuards(GqlAuthGuard)
    public async resetPassword(
        @CurrentUser() user: User,
        @Args('input') input: ResetPasswordDto
    ): Promise<UserTokens>{
        return await this.authService.resetPassword(input, user.uuid);
    }

    @Mutation(() => String)
    public async forgotPasswordRequest(
        @Args('input') input: ForgotPasswordRequestDto,
    ){
        return this.authService.requestForgotPassword(input);
    }

    @Mutation(() => Boolean)
    public async verifyPasswordResetCode (
        @Args('input') input: VerifyPasswordResetCodeDto,
    ) {
        return await this.authService.verifyPasswordResetCode(input);
    }

    @Mutation(() => UserTokens)
    public async resetPasswordWithCode(
        @Args('input') input: ResetPasswordWithCodeDto
    ): Promise<UserTokens>{
        return await this.authService.resetPasswordWithCode(input);
    }
}
