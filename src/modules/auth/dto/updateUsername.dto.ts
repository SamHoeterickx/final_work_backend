import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateUsernameDto {
    @Field()
    @IsNotEmpty()
    updatedUsername: string;
}
