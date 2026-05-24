import { Field, InputType } from '@nestjs/graphql';
import {
    IsEmail,
    IsNotEmpty,
    IsString,
    Matches,
    MinLength,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OnboardingInput } from './onboardingInput.dto';

@InputType()
export class CreateUserDto {
    @Field()
    @IsString()
    @IsNotEmpty()
    @MinLength(1, { message: 'Name is too short' })
    name: string;

    @Field()
    @IsEmail()
    @IsNotEmpty()
    @MinLength(1, { message: 'Email is too short' })
    email: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    @MinLength(8, { message: 'Password is too short' })
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'password too weak',
    })
    password: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    @MinLength(8, { message: 'Repeat password is too short' })
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'password too weak',
    })
    repeatPassword: string;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    @Field(() => OnboardingInput)
    @ValidateNested()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    @Type(() => OnboardingInput)
    onboarding: OnboardingInput;
}
