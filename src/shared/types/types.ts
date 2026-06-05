import { registerEnumType } from '@nestjs/graphql';
import { UserStreaks } from '../../modules/auth/entity/user_streak.entity';

export enum UserRoleType {
    ADMIN = 'ADMIN',
    USER = 'USER',
}
registerEnumType(UserRoleType, {
    name: 'EUserRoleType',
});

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
    isStreaksUpdated: boolean;
}

export interface IUpdateXP extends IHandleStreakUpdate {
    prevUserXP: number;
    newUserXP: number;
}

export interface ILessonTranslations {
    name: string;
    description: string;
    languageCode: ELocales;
    content: any[];
}

export enum EProgressStatus {
    LOCKED = 'LOCKED',
    UNLOCKED = 'UNLOCKED',
    INPROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
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
    ADVANCED = 'ADVANCED',
}

export enum EUserLevels {
    BEGINNER = 'BEGINNER',
}
registerEnumType(EUserLevels, {
    name: 'EUserLevels',
});

export enum ELocales {
    NL = 'nl',
    FR = 'fr',
    EN = 'en',
}
registerEnumType(ELocales, {
    name: 'ELocales',
});

export enum ELessonScreenOptions {
    C_TITLE,
    C_DID_YOU_KNOW,
    C_TEXT_WITH_IMAGE,
    C_ONLY_TEXT,
    C_VIDEO,
    Q_RIGHT_OR_WRONG,
    Q_MATCH,
    Q_CLICK_AND_FOCUS,
}

registerEnumType(ELessonScreenOptions, {
    name: 'ELessonScreenOptions',
});
