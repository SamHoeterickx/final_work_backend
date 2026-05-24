import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveLevelAndAddLanguageToUser1779023856174 implements MigrationInterface {
    name = 'RemoveLevelAndAddLanguageToUser1779023856174';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "users" RENAME COLUMN "level" TO "language"`,
        );
        await queryRunner.query(
            `ALTER TYPE "public"."users_level_enum" RENAME TO "users_language_enum"`,
        );
        await queryRunner.query(
            `ALTER TYPE "public"."users_language_enum" RENAME TO "users_language_enum_old"`,
        );
        await queryRunner.query(
            `CREATE TYPE "public"."users_language_enum" AS ENUM('nl', 'fr', 'en')`,
        );
        await queryRunner.query(
            `ALTER TABLE "users" ALTER COLUMN "language" DROP DEFAULT`,
        );
        await queryRunner.query(
            `ALTER TABLE "users" ALTER COLUMN "language" TYPE "public"."users_language_enum" USING 'en'::"public"."users_language_enum"`,
        );
        await queryRunner.query(
            `ALTER TABLE "users" ALTER COLUMN "language" SET DEFAULT 'en'`,
        );
        await queryRunner.query(`DROP TYPE "public"."users_language_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TYPE "public"."users_language_enum_old" AS ENUM('BEGINNER')`,
        );
        await queryRunner.query(
            `ALTER TABLE "users" ALTER COLUMN "language" DROP DEFAULT`,
        );
        await queryRunner.query(
            `ALTER TABLE "users" ALTER COLUMN "language" TYPE "public"."users_language_enum_old" USING 'BEGINNER'::"public"."users_language_enum_old"`,
        );
        await queryRunner.query(
            `ALTER TABLE "users" ALTER COLUMN "language" SET DEFAULT 'BEGINNER'`,
        );
        await queryRunner.query(`DROP TYPE "public"."users_language_enum"`);
        await queryRunner.query(
            `ALTER TYPE "public"."users_language_enum_old" RENAME TO "users_language_enum"`,
        );
        await queryRunner.query(
            `ALTER TYPE "public"."users_language_enum" RENAME TO "users_level_enum"`,
        );
        await queryRunner.query(
            `ALTER TABLE "users" RENAME COLUMN "language" TO "level"`,
        );
    }
}
