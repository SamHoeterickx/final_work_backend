import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { FindUserField } from 'src/shared/types/types';

@InputType()
export class FindUserOption {
    @Field(() => FindUserField)
    @IsNotEmpty()
    @IsEnum(FindUserField)
    option: FindUserField;

    @Field()
    @IsString()
    @IsNotEmpty()
    value: string;
}
