import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";

@InputType()
export class ResetPasswordWithCodeDto {
    @Field()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @Field()
    @IsString()
    @MinLength(8, { message: 'Code is too short'})
    @MaxLength(8, { message: 'Code is too long'})
    resetCode: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    @MinLength(8, { message: 'Password is too short' })
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'password too weak',
    })
    newPassword: string;
}