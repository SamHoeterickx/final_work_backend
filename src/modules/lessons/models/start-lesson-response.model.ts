import { Field, ID, Int, ObjectType } from "@nestjs/graphql";
import { EProgressStatus } from "../../../shared/types/types";
import { LessonTranslation } from "../entity/lesson_translation.entity";

@ObjectType()
export class StartLessonResponse {
    @Field(() => ID)
    uuid: string;

    @Field(() => Int)
    estimatedDuration: number;

    @Field(() => Int)
    xp: number;

    @Field(() => Int)
    order: number;

    @Field(() => [LessonTranslation])
    content: LessonTranslation[];
}