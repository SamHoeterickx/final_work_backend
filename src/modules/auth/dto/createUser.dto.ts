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
    @MinLength(1, { message: 'Firstname is to short' })
    firstname: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    @MinLength(1, { message: 'Lastname is to short' })
    lastname: string;

    @Field()
    @IsEmail()
    @IsNotEmpty()
    @MinLength(1, { message: 'Email is to short' })
    email: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    @MinLength(8, { message: 'Password is to short' })
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'password too weak',
    })
    password: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    @MinLength(8, { message: 'Repeat password is to short' })
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'password too weak',
    })
    repeatPassword: string;
}
