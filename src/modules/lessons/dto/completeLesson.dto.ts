import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsString } from "class-validator";

@InputType()
export class CompleteLessonDto {
    @Field()
    @IsString()
    @IsNotEmpty()
    lessonUuid: string;
}