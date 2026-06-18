import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ELocales, EPlatform } from '../../../shared/types/types';

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

    @Field({ nullable: true })
    @IsOptional()
    @IsEnum(ELocales)
    language?: ELocales;
}
