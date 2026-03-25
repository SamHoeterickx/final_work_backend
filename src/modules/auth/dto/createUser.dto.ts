import {
    IsEmail,
    IsNotEmpty,
    IsString,
    Matches,
    MinLength,
} from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(1, { message: 'Firstname is to short' })
    firstname: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(1, { message: 'Lastname is to short' })
    lastname: string;

    @IsEmail()
    @IsNotEmpty()
    @MinLength(1, { message: 'Email is to short' })
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8, { message: 'Password is to short' })
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'password too weak',
    })
    password: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8, { message: 'Repeat password is to short' })
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'password too weak',
    })
    repeatPassword: string;
}
