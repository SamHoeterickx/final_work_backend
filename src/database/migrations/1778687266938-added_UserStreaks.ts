import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedUserStreaks1778687266938 implements MigrationInterface {
    name = 'AddedUserStreaks1778687266938';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "user_streaks" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "currentStreak" integer NOT NULL DEFAULT '0', "longestStreak" integer NOT NULL DEFAULT '0', "lastCompletedDate" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "userUuid" uuid, CONSTRAINT "REL_838ed7822ff75adcb6c02df10b" UNIQUE ("userUuid"), CONSTRAINT "PK_f6af4d85f791422060aca45f2de" PRIMARY KEY ("uuid"))`,
        );
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "streaks"`);
        await queryRunner.query(
            `ALTER TABLE "user_streaks" ADD CONSTRAINT "FK_838ed7822ff75adcb6c02df10be" FOREIGN KEY ("userUuid") REFERENCES "users"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "user_streaks" DROP CONSTRAINT "FK_838ed7822ff75adcb6c02df10be"`,
        );
        await queryRunner.query(
            `ALTER TABLE "users" ADD "streaks" integer NOT NULL DEFAULT '0'`,
        );
        await queryRunner.query(`DROP TABLE "user_streaks"`);
    }
}
