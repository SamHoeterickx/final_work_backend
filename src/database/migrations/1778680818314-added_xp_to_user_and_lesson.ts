import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedXpToUserAndLesson1778680818314 implements MigrationInterface {
    name = 'AddedXpToUserAndLesson1778680818314';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "users" ADD "xp" integer NOT NULL DEFAULT '0'`,
        );
        await queryRunner.query(
            `ALTER TABLE "users" ADD "streaks" integer NOT NULL DEFAULT '0'`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "streaks"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "xp"`);
    }
}
