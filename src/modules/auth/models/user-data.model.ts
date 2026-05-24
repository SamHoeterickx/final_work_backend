import { Field, ObjectType } from '@nestjs/graphql';
import { UserRoleType } from '../../../shared/types/types';
import { UserStreaks } from '../entity/user_streak.entity';

@ObjectType()
export class UserData {
    @Field()
    name: string;

    @Field()
    email: string;

    @Field()
    role: UserRoleType;

    @Field()
    xp: number;

    @Field()
    streaks: UserStreaks;
}
