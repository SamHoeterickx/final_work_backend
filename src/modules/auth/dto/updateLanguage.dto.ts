import { Field, InputType } from "@nestjs/graphql";
import { IsEnum, IsNotEmpty } from "class-validator";
import { ELocales } from "../../../shared/types/types";

@InputType()
export class UpdateLanguageDto {
    @IsEnum(ELocales)
    @IsNotEmpty()
    @Field()
    language: ELocales;
}   