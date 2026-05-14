import { Field, ObjectType } from '@nestjs/graphql';
import { EUserLevels, UserRoleType } from '../../../shared/types/types';

@ObjectType()
export class UserData {
    @Field()
    name: string;

    @Field()
    email: string;

    @Field()
    role: UserRoleType;

    @Field()
    level: EUserLevels;
}
