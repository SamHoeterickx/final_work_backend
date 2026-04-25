import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

@InputType()
export class RequestPasswordReset {
        @Field()
        @IsEmail()
        @IsNotEmpty()
        @MinLength(1, { message: 'Email is too short'})
        email: string;      
}