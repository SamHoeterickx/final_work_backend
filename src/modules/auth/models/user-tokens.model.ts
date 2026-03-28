import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserTokens {
    @Field()
    accessToken: string;

    @Field()
    refreshToken: string;
}
