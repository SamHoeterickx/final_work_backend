import { MigrationInterface, QueryRunner } from 'typeorm';

export class OnboardingV41774620802509 implements MigrationInterface {
    name = 'OnboardingV41774620802509';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "user_profiles" RENAME COLUMN "goals" TO "goal"`,
        );
        await queryRunner.query(
            `ALTER TABLE "user_profiles" DROP COLUMN "goal"`,
        );
        await queryRunner.query(
            `ALTER TABLE "user_profiles" ADD "goal" text NOT NULL`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "user_profiles" DROP COLUMN "goal"`,
        );
        await queryRunner.query(
            `ALTER TABLE "user_profiles" ADD "goal" text array NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE "user_profiles" RENAME COLUMN "goal" TO "goals"`,
        );
    }
}
