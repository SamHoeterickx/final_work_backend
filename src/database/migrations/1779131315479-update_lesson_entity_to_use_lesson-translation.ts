import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateLessonEntityToUseLessonTranslation1779131315479 implements MigrationInterface {
    name = 'UpdateLessonEntityToUseLessonTranslation1779131315479';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TYPE "public"."lesson_translations_languagecode_enum" AS ENUM('nl', 'fr', 'en')`,
        );
        await queryRunner.query(
            `CREATE TABLE "lesson_translations" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "languageCode" "public"."lesson_translations_languagecode_enum" NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "content" jsonb NOT NULL, "lessonUuid" uuid, CONSTRAINT "PK_e92c5813bce5498e5089786e111" PRIMARY KEY ("uuid"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "lessons" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "estimatedDuration" integer NOT NULL, "xp" integer NOT NULL DEFAULT '0', "order" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "chapterUuid" uuid, CONSTRAINT "PK_67edbf998244ca30b18a280c9a9" PRIMARY KEY ("uuid"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "lesson_user" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" "public"."lesson_user_status_enum" NOT NULL DEFAULT 'LOCKED', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "userUuid" uuid, "lessonUuid" uuid, CONSTRAINT "PK_76f265068ebde54e969c40d46f3" PRIMARY KEY ("uuid"))`,
        );
        await queryRunner.query(
            `ALTER TABLE "lesson_translations" ADD CONSTRAINT "FK_9088274142cb789ce4c2b2dd8a8" FOREIGN KEY ("lessonUuid") REFERENCES "lessons"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "lessons" ADD CONSTRAINT "FK_c42c79d565b26bb951cceba81f0" FOREIGN KEY ("chapterUuid") REFERENCES "chapters"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "lesson_user" ADD CONSTRAINT "FK_77905c16ec38083c6e9bcfd1c95" FOREIGN KEY ("userUuid") REFERENCES "users"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "lesson_user" ADD CONSTRAINT "FK_da08ec077552e095b0bdf2a6185" FOREIGN KEY ("lessonUuid") REFERENCES "lessons"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "lesson_user" DROP CONSTRAINT "FK_da08ec077552e095b0bdf2a6185"`,
        );
        await queryRunner.query(
            `ALTER TABLE "lesson_user" DROP CONSTRAINT "FK_77905c16ec38083c6e9bcfd1c95"`,
        );
        await queryRunner.query(
            `ALTER TABLE "lessons" DROP CONSTRAINT "FK_c42c79d565b26bb951cceba81f0"`,
        );
        await queryRunner.query(
            `ALTER TABLE "lesson_translations" DROP CONSTRAINT "FK_9088274142cb789ce4c2b2dd8a8"`,
        );
        await queryRunner.query(`DROP TABLE "lesson_user"`);
        await queryRunner.query(`DROP TABLE "lessons"`);
        await queryRunner.query(`DROP TABLE "lesson_translations"`);
        await queryRunner.query(
            `DROP TYPE "public"."lesson_translations_languagecode_enum"`,
        );
    }
}
