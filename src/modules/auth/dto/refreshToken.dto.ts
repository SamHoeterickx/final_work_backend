import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class RefresTokenDto {
    @Field()
    @IsString()
    @IsNotEmpty()
    refreshToken: string;
}
