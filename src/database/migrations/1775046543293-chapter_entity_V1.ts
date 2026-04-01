import { MigrationInterface, QueryRunner } from "typeorm";

export class ChapterEntityV11775046543293 implements MigrationInterface {
    name = 'ChapterEntityV11775046543293'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."chapter_tags_enum" AS ENUM('TEST_1')`);
        await queryRunner.query(`CREATE TABLE "chapter" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, "order" integer NOT NULL, "tags" "public"."chapter_tags_enum" array DEFAULT '{TEST_1}', "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_23503a9daa0f9cea60cbcdb632c" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`ALTER TABLE "lesson" ADD "chapterUuid" uuid`);
        await queryRunner.query(`ALTER TABLE "lesson" ADD CONSTRAINT "FK_09c5d39a175a3731001535ce523" FOREIGN KEY ("chapterUuid") REFERENCES "chapter"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lesson" DROP CONSTRAINT "FK_09c5d39a175a3731001535ce523"`);
        await queryRunner.query(`ALTER TABLE "lesson" DROP COLUMN "chapterUuid"`);
        await queryRunner.query(`DROP TABLE "chapter"`);
        await queryRunner.query(`DROP TYPE "public"."chapter_tags_enum"`);
    }

}
