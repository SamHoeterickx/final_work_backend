import { MigrationInterface, QueryRunner } from "typeorm";

export class UppercaseStatus1778336208047 implements MigrationInterface {
    name = 'UppercaseStatus1778336208047'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."lesson_user_status_enum" RENAME TO "lesson_user_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."lesson_user_status_enum" AS ENUM('LOCKED', 'UNLOCKED', 'IN_PROGRESS', 'COMPLETED')`);
        await queryRunner.query(`ALTER TABLE "lesson_user" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "lesson_user" ALTER COLUMN "status" TYPE "public"."lesson_user_status_enum" USING "status"::"text"::"public"."lesson_user_status_enum"`);
        await queryRunner.query(`ALTER TABLE "lesson_user" ALTER COLUMN "status" SET DEFAULT 'LOCKED'`);
        await queryRunner.query(`DROP TYPE "public"."lesson_user_status_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."chapter_user_status_enum" RENAME TO "chapter_user_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."chapter_user_status_enum" AS ENUM('LOCKED', 'UNLOCKED', 'IN_PROGRESS', 'COMPLETED')`);
        await queryRunner.query(`ALTER TABLE "chapter_user" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "chapter_user" ALTER COLUMN "status" TYPE "public"."chapter_user_status_enum" USING "status"::"text"::"public"."chapter_user_status_enum"`);
        await queryRunner.query(`ALTER TABLE "chapter_user" ALTER COLUMN "status" SET DEFAULT 'LOCKED'`);
        await queryRunner.query(`DROP TYPE "public"."chapter_user_status_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."chapter_user_status_enum_old" AS ENUM('locked', 'unlocked', 'in_progress', 'completed')`);
        await queryRunner.query(`ALTER TABLE "chapter_user" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "chapter_user" ALTER COLUMN "status" TYPE "public"."chapter_user_status_enum_old" USING "status"::"text"::"public"."chapter_user_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "chapter_user" ALTER COLUMN "status" SET DEFAULT 'locked'`);
        await queryRunner.query(`DROP TYPE "public"."chapter_user_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."chapter_user_status_enum_old" RENAME TO "chapter_user_status_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."lesson_user_status_enum_old" AS ENUM('locked', 'unlocked', 'in_progress', 'completed')`);
        await queryRunner.query(`ALTER TABLE "lesson_user" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "lesson_user" ALTER COLUMN "status" TYPE "public"."lesson_user_status_enum_old" USING "status"::"text"::"public"."lesson_user_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "lesson_user" ALTER COLUMN "status" SET DEFAULT 'locked'`);
        await queryRunner.query(`DROP TYPE "public"."lesson_user_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."lesson_user_status_enum_old" RENAME TO "lesson_user_status_enum"`);
    }

}
