import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserLevel1778659513703 implements MigrationInterface {
    name = 'AddUserLevel1778659513703';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TYPE "public"."users_level_enum" AS ENUM('BEGINNER')`,
        );
        await queryRunner.query(
            `ALTER TABLE "users" ADD "level" "public"."users_level_enum" NOT NULL DEFAULT 'BEGINNER'`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "level"`);
        await queryRunner.query(`DROP TYPE "public"."users_level_enum"`);
    }
}
