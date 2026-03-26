export enum UserRoleType {
    ADMIN = 'ADMIN',
    USER = 'USER',
}

export interface IUserTokens {
    accessToken: string;
    refreshToken: string;
}
