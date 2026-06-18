import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEarlyAccessSingups1781775319159 implements MigrationInterface {
    name = 'AddEarlyAccessSingups1781775319159';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TYPE "public"."early_access_signups_platform_enum" AS ENUM('ios', 'android')`,
        );
        await queryRunner.query(
            `CREATE TABLE "early_access_signups" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "platform" "public"."early_access_signups_platform_enum" NOT NULL DEFAULT 'android', "date" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c75d9c784ef610d2ef74b4caed9" PRIMARY KEY ("uuid"))`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "early_access_signups"`);
        await queryRunner.query(
            `DROP TYPE "public"."early_access_signups_platform_enum"`,
        );
    }
}
