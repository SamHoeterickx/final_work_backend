import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

@InputType()
export class ResetPasswordDto {
        @Field()
        @IsString()
        @IsNotEmpty()
        @MinLength(8, { message: 'Password is too short' })
        @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
                message: 'password too weak',
        })
        oldPassword: string;

        @Field()
        @IsString()
        @IsNotEmpty()
        @MinLength(8, { message: 'Password is too short' })
        @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
                message: 'password too weak',
        })
        newPassword: string;

        @Field()
        @IsString()
        @IsNotEmpty()
        @MinLength(8, { message: 'Password is too short' })
        @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
                message: 'password too weak',
        })
        repeatNewPassword: string;

}