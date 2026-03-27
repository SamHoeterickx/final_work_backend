import { MigrationInterface, QueryRunner } from "typeorm";

export class UserWOnboardingHashedRefreshToken1774623031933 implements MigrationInterface {
    name = 'UserWOnboardingHashedRefreshToken1774623031933'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "currentHashedRefreshToken" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "currentHashedRefreshToken"`);
    }

}
