import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/loginUser.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { RefresTokenDto } from './dto/refreshToken.dto';
import { UserTokens } from './models/user-tokens.model';

@Resolver()
export class AuthResolver {
    constructor(private authService: AuthService) {}

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
        @Args('input') input: RefresTokenDto
    ): Promise<UserTokens> {
        return this.authService.refreshTokens(input);
    }
}
