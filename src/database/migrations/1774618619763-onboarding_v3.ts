import { MigrationInterface, QueryRunner } from "typeorm";

export class OnboardingV31774618619763 implements MigrationInterface {
    name = 'OnboardingV31774618619763'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_profiles" ALTER COLUMN "currentMethodes" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_profiles" ALTER COLUMN "extraGear" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_profiles" ALTER COLUMN "fullOnboardingData" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_profiles" ALTER COLUMN "fullOnboardingData" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_profiles" ALTER COLUMN "extraGear" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_profiles" ALTER COLUMN "currentMethodes" SET NOT NULL`);
    }

}
