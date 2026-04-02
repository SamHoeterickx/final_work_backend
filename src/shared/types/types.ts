import { registerEnumType } from '@nestjs/graphql';

//===========================
//==========ENUMS============
//===========================

export enum UserRoleType {
    ADMIN = 'ADMIN',
    USER = 'USER',
}

export enum TagOptions {
    TEST = 'TEST_1',
}
registerEnumType(TagOptions, { name: 'TagOptions' });

export enum GetChapterOptionEnum {
    UUID = 'uuid',
    SLUG = 'slug',
    NAME = 'name',
}
registerEnumType(GetChapterOptionEnum, { name: 'GetChapterOptionEnum' });

export enum ChapterFilterField {
    NAME = 'name',
    DESCRIPTION = 'description',
    TAGS = 'tags',
    SLUG = 'slug',
}
registerEnumType(ChapterFilterField, { name: 'ChapterFilterField' });

export enum FindUserField {
    UUID = 'uuid',
    FIRSTNAME = 'firstname',
    EMAIL = 'email',
    ROLE = 'role',
}
registerEnumType(FindUserField, { name: 'FindUserField' });

//===========================
//==========TYPES============
//===========================
export interface IUserTokens {
    accessToken: string;
    refreshToken: string;
}

export interface IOnboardingData {
    currentBehaviour: string[];
    experienceLevel: string;
    goal: string;
    currentPreferences: string;
    desiredTempo: string;
    currentMethodes: string[] | null;
    extraGear: string[] | null;
}
