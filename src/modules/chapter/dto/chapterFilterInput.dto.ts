import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ChapterFilterField } from 'src/shared/types/types';

@InputType()
export class ChapterFieldInput {
    @Field(() => ChapterFilterField)
    @IsNotEmpty()
    @IsEnum(ChapterFilterField)
    option: ChapterFilterField;

    @Field()
    @IsString()
    @IsNotEmpty()
    value: string;
}
