import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class DeleteUserDto {
    @Field()
    @IsNotEmpty()
    password: string;
}
