import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { GetChapterOptionEnum } from 'src/shared/types/types';

@InputType()
export class GetChapterOption {
    @Field()
    @IsNotEmpty()
    @IsEnum(GetChapterOptionEnum)
    option: GetChapterOptionEnum;

    @Field()
    @IsString()
    @IsNotEmpty()
    value: string;
}
