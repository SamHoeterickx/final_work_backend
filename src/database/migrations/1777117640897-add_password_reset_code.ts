import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPasswordResetCode1777117640897 implements MigrationInterface {
    name = 'AddPasswordResetCode1777117640897';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "users" ADD "passwordResetCode" character varying`,
        );
        await queryRunner.query(
            `ALTER TABLE "users" ADD "passwordResetExpires" TIMESTAMP`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "users" DROP COLUMN "passwordResetExpires"`,
        );
        await queryRunner.query(
            `ALTER TABLE "users" DROP COLUMN "passwordResetCode"`,
        );
    }
}
