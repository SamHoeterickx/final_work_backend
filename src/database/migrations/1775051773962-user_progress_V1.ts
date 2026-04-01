import { MigrationInterface, QueryRunner } from "typeorm";

export class UserProgressV11775051773962 implements MigrationInterface {
    name = 'UserProgressV11775051773962'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_progress" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "isCompleted" boolean NOT NULL DEFAULT false, "completed_at" TIMESTAMP NOT NULL DEFAULT now(), "userUuid" uuid, "lessonUuid" uuid, CONSTRAINT "PK_8c026adf878922ad59fd1f05ba3" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`ALTER TABLE "user_progress" ADD CONSTRAINT "FK_5d19aac9dc9a744b0bcc4c99524" FOREIGN KEY ("userUuid") REFERENCES "users"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_progress" ADD CONSTRAINT "FK_838ce37fe9bb8cb57e46c1d0c1c" FOREIGN KEY ("lessonUuid") REFERENCES "lesson"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_progress" DROP CONSTRAINT "FK_838ce37fe9bb8cb57e46c1d0c1c"`);
        await queryRunner.query(`ALTER TABLE "user_progress" DROP CONSTRAINT "FK_5d19aac9dc9a744b0bcc4c99524"`);
        await queryRunner.query(`DROP TABLE "user_progress"`);
    }

}
