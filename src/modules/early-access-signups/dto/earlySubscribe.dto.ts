import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsEnum, IsNotEmpty } from "class-validator";
import { EPlatform } from "../../../shared/types/types";

@InputType()
export class EarlySubscribeDto {
    @Field()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @Field()
    @IsNotEmpty()
    @IsEnum(EPlatform)
    platform: EPlatform;
}