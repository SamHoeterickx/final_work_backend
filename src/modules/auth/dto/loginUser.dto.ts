import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

@InputType()
export class LoginUserDto {
    @Field()
    @IsEmail()
    @IsNotEmpty()
    @MinLength(1, { message: 'Email is to short' })
    email: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    password: string;
}
