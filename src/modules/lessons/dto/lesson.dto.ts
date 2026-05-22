import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { ELocales } from '../../../shared/types/types';

@InputType()
export class LessonDto {
    @Field()
    @IsNotEmpty()
    @IsUUID()
    lessonUuid: string;

    @Field()
    @IsEnum(ELocales)
    languageCode: ELocales;
}
