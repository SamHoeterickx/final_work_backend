import { MigrationInterface, QueryRunner } from "typeorm";

export class LessonEntityV11775043357607 implements MigrationInterface {
    name = 'LessonEntityV11775043357607'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "lesson" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, "order" integer NOT NULL, "durationMinutes" integer NOT NULL DEFAULT '1', "content" jsonb NOT NULL DEFAULT '{}', "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d6c334a318d15d1d58ee0c3a013" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`CREATE TABLE "lesson_dependencies" ("lesson_id_1" uuid NOT NULL, "lesson_id_2" uuid NOT NULL, CONSTRAINT "PK_2c898f640a09ab0d1986f455af6" PRIMARY KEY ("lesson_id_1", "lesson_id_2"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6f959bb0f47a360bde2dc6d742" ON "lesson_dependencies" ("lesson_id_1") `);
        await queryRunner.query(`CREATE INDEX "IDX_eb0ee519dea180d7dd4f904b0b" ON "lesson_dependencies" ("lesson_id_2") `);
        await queryRunner.query(`ALTER TABLE "lesson_dependencies" ADD CONSTRAINT "FK_6f959bb0f47a360bde2dc6d7428" FOREIGN KEY ("lesson_id_1") REFERENCES "lesson"("uuid") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "lesson_dependencies" ADD CONSTRAINT "FK_eb0ee519dea180d7dd4f904b0bc" FOREIGN KEY ("lesson_id_2") REFERENCES "lesson"("uuid") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lesson_dependencies" DROP CONSTRAINT "FK_eb0ee519dea180d7dd4f904b0bc"`);
        await queryRunner.query(`ALTER TABLE "lesson_dependencies" DROP CONSTRAINT "FK_6f959bb0f47a360bde2dc6d7428"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_eb0ee519dea180d7dd4f904b0b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6f959bb0f47a360bde2dc6d742"`);
        await queryRunner.query(`DROP TABLE "lesson_dependencies"`);
        await queryRunner.query(`DROP TABLE "lesson"`);
    }

}
