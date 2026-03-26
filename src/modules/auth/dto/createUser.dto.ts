import { Field, InputType } from '@nestjs/graphql';
import {
    IsEmail,
    IsNotEmpty,
    IsString,
    Matches,
    MinLength,
} from 'class-validator';

@InputType()
export class CreateUserDto {
    @Field()
    @IsString()
    @IsNotEmpty()
    @MinLength(1, { message: 'Firstname is too short' })
    firstname: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    @MinLength(1, { message: 'Lastname is too short' })
    lastname: string;

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
}
