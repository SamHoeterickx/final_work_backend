import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class LoginUserDto {
    @IsEmail()
    @IsNotEmpty()
    @MinLength(1, {message: 'Email is to short'})
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}