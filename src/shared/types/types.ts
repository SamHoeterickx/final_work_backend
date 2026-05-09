export enum UserRoleType {
    ADMIN = 'ADMIN',
    USER = 'USER',
}

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

export enum EProgressStatus {
    LOCKED = 'locked',
    UNLOCKED = 'unlocked',
    INPROGRESS = 'in_progress',
    COMPLETED = 'completed'
}

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