import { MigrationInterface, QueryRunner } from 'typeorm';

export class LessonsChaptersProgress1778165482232 implements MigrationInterface {
    name = 'LessonsChaptersProgress1778165482232';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "user_profiles" DROP CONSTRAINT "FK_b95d23376e021671f5806dd5f3a"`,
        );
        await queryRunner.query(
            `CREATE TABLE "chapters" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, "tags" text array NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_af9c9ecbe2e5d87eecc4f9128f1" PRIMARY KEY ("uuid"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "lessons" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, "estimatedDuration" integer NOT NULL, "content" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "chapterUuid" uuid, CONSTRAINT "PK_67edbf998244ca30b18a280c9a9" PRIMARY KEY ("uuid"))`,
        );
        await queryRunner.query(
            `CREATE TYPE "public"."lesson_user_status_enum" AS ENUM('locked', 'unlocked', 'in_progress', 'completed')`,
        );
        await queryRunner.query(
            `CREATE TABLE "lesson_user" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" "public"."lesson_user_status_enum" NOT NULL DEFAULT 'locked', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "userUuid" uuid, "lessonUuid" uuid, CONSTRAINT "PK_76f265068ebde54e969c40d46f3" PRIMARY KEY ("uuid"))`,
        );
        await queryRunner.query(
            `CREATE TYPE "public"."chapter_user_status_enum" AS ENUM('locked', 'unlocked', 'in_progress', 'completed')`,
        );
        await queryRunner.query(
            `CREATE TABLE "chapter_user" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" "public"."chapter_user_status_enum" NOT NULL DEFAULT 'locked', "order" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "userUuid" uuid, "chapterUuid" uuid, CONSTRAINT "PK_b7ea37d5c62e198e2a72994205d" PRIMARY KEY ("uuid"))`,
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
        await queryRunner.query(
            `ALTER TABLE "chapter_user" ADD CONSTRAINT "FK_c1ef031fe9589828ebbd448d276" FOREIGN KEY ("userUuid") REFERENCES "users"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "chapter_user" ADD CONSTRAINT "FK_2d7e8ec9bbe29c782918954ff47" FOREIGN KEY ("chapterUuid") REFERENCES "chapters"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "user_profiles" ADD CONSTRAINT "FK_b95d23376e021671f5806dd5f3a" FOREIGN KEY ("userUuid") REFERENCES "users"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "user_profiles" DROP CONSTRAINT "FK_b95d23376e021671f5806dd5f3a"`,
        );
        await queryRunner.query(
            `ALTER TABLE "chapter_user" DROP CONSTRAINT "FK_2d7e8ec9bbe29c782918954ff47"`,
        );
        await queryRunner.query(
            `ALTER TABLE "chapter_user" DROP CONSTRAINT "FK_c1ef031fe9589828ebbd448d276"`,
        );
        await queryRunner.query(
            `ALTER TABLE "lesson_user" DROP CONSTRAINT "FK_da08ec077552e095b0bdf2a6185"`,
        );
        await queryRunner.query(
            `ALTER TABLE "lesson_user" DROP CONSTRAINT "FK_77905c16ec38083c6e9bcfd1c95"`,
        );
        await queryRunner.query(
            `ALTER TABLE "lessons" DROP CONSTRAINT "FK_c42c79d565b26bb951cceba81f0"`,
        );
        await queryRunner.query(`DROP TABLE "chapter_user"`);
        await queryRunner.query(
            `DROP TYPE "public"."chapter_user_status_enum"`,
        );
        await queryRunner.query(`DROP TABLE "lesson_user"`);
        await queryRunner.query(`DROP TYPE "public"."lesson_user_status_enum"`);
        await queryRunner.query(`DROP TABLE "lessons"`);
        await queryRunner.query(`DROP TABLE "chapters"`);
        await queryRunner.query(
            `ALTER TABLE "user_profiles" ADD CONSTRAINT "FK_b95d23376e021671f5806dd5f3a" FOREIGN KEY ("userUuid") REFERENCES "users"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }
}
