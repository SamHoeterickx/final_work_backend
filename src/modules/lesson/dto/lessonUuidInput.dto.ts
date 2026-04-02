import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class LessonUuidInput {
    @Field()
    @IsString()
    @IsNotEmpty()
    uuid: string;
}
