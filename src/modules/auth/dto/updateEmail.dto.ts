import { Field, InputType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@InputType()
export class UpdateEmailDto {
    @Field()
    @IsEmail()
    updatedEmailAdress: string;
}
