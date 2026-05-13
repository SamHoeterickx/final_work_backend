import { registerEnumType } from "@nestjs/graphql";
import { UserStreaks } from "../../modules/auth/entity/user_streak.entity";

export enum UserRoleType {
    ADMIN = 'ADMIN',
    USER = 'USER',
}
registerEnumType(UserRoleType, {
    name: 'EUserRoleType',
})

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
export interface IEmailOptions {
    reciever: string;
    message: string;
    subject: string;
}

export interface IHandleStreakUpdate {
    prevStreak: number;
    newStreak: number; 
    streak: UserStreaks;
}

export interface IUpdateXP extends IHandleStreakUpdate{
    prevUserXP: number;
    newUserXP: number;
}

export enum EProgressStatus {
    LOCKED = 'LOCKED',
    UNLOCKED = 'UNLOCKED',
    INPROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED'
}
registerEnumType(EProgressStatus, {
    name: 'EProgressStatus',
});

export enum ETagOptions {
    TEST = 'TEST_1',
    BASICS = 'BASICS',
    BREWING = 'BREWING',
    EQUIPMENT = 'EQUIPMENT',
    CHEMISTRY = 'CHEMISTRY',
    ROASTING = 'ROASTING',
    ORIGINS = 'ORIGINS',
    HISTORY = 'HISTORY',
    ETHICS = 'ETHICS',
    BIOLOGY = 'BIOLOGY',
    ADVANCED = 'ADVANCED'
}

export enum EUserLevels {
    BEGINNER = 'BEGINNER'
}
registerEnumType(EUserLevels, {
    name: 'EUserLevels',
})