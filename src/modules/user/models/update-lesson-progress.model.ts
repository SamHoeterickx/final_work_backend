import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class UpdateLessonProgress {
    @Field()
    status: string;
}