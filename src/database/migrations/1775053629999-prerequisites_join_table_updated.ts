import { MigrationInterface, QueryRunner } from 'typeorm';

export class PrerequisitesJoinTableUpdated1775053629999 implements MigrationInterface {
    name = 'PrerequisitesJoinTableUpdated1775053629999';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "lesson_dependencies" DROP CONSTRAINT "FK_6f959bb0f47a360bde2dc6d7428"`,
        );
        await queryRunner.query(
            `ALTER TABLE "lesson_dependencies" DROP CONSTRAINT "FK_eb0ee519dea180d7dd4f904b0bc"`,
        );
        await queryRunner.query(
            `DROP INDEX "public"."IDX_6f959bb0f47a360bde2dc6d742"`,
        );
        await queryRunner.query(
            `DROP INDEX "public"."IDX_eb0ee519dea180d7dd4f904b0b"`,
        );
        await queryRunner.query(
            `ALTER TABLE "lesson_dependencies" DROP CONSTRAINT "PK_2c898f640a09ab0d1986f455af6"`,
        );
        await queryRunner.query(
            `ALTER TABLE "lesson_dependencies" ADD CONSTRAINT "PK_eb0ee519dea180d7dd4f904b0bc" PRIMARY KEY ("lesson_id_2")`,
        );
        await queryRunner.query(
            `ALTER TABLE "lesson_dependencies" DROP COLUMN "lesson_id_1"`,
        );
        await queryRunner.query(
            `ALTER TABLE "lesson_dependencies" DROP CONSTRAINT "PK_eb0ee519dea180d7dd4f904b0bc"`,
        );
        await queryRunner.query(
            `ALTER TABLE "lesson_dependencies" DROP COLUMN "lesson_id_2"`,
        );
        await queryRunner.query(
            `ALTER TABLE "lesson_dependencies" ADD "lesson_id" uuid NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE "lesson_dependencies" ADD CONSTRAINT "PK_0a25bce110e9e1c7732422e9858" PRIMARY KEY ("lesson_id")`,
        );
        await queryRunner.query(
            `ALTER TABLE "lesson_dependencies" ADD "prerequisite_id" uuid NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE "lesson_dependencies" DROP CONSTRAINT "PK_0a25bce110e9e1c7732422e9858"`,
        );
        await queryRunner.query(
            `ALTER TABLE "lesson_dependencies" ADD CONSTRAINT "PK_e173fe5bc29780436c9b83fb1bc" PRIMARY KEY ("lesson_id", "prerequisite_id")`,
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_0a25bce110e9e1c7732422e985" ON "lesson_dependencies" ("lesson_id") `,
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_b8fd2fff8442b267858c791d5d" ON "lesson_dependencies" ("prerequisite_id") `,
        );
        await queryRunner.query(
            `ALTER TABLE "lesson_dependencies" ADD CONSTRAINT "FK_0a25bce110e9e1c7732422e9858" FOREIGN KEY ("lesson_id") REFERENCES "lesson"("uuid") ON DELETE CASCADE ON UPDATE CASCADE`,
        );
        await queryRunner.query(
            `ALTER TABLE "lesson_dependencies" ADD CONSTRAINT "FK_b8fd2fff8442b267858c791d5de" FOREIGN KEY ("prerequisite_id") REFERENCES "lesson"("uuid") ON DELETE CASCADE ON UPDATE CASCADE`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "lesson_dependencies" DROP CONSTRAINT "FK_b8fd2fff8442b267858c791d5de"`,
        );
        await queryRunner.query(
            `ALTER TABLE "lesson_dependencies" DROP CONSTRAINT "FK_0a25bce110e9e1c7732422e9858"`,
        );
        await queryRunner.query(
            `DROP INDEX "public"."IDX_b8fd2fff8442b267858c791d5d"`,
        );
        await queryRunner.query(
            `DROP INDEX "public"."IDX_0a25bce110e9e1c7732422e985"`,
        );
        await queryRunner.query(
            `ALTER TABLE "lesson_dependencies" DROP CONSTRAINT "PK_e173fe5bc29780436c9b83fb1bc"`,
        );
        await queryRunner.query(
            `ALTER TABLE "lesson_dependencies" ADD CONSTRAINT "PK_0a25bce110e9e1c7732422e9858" PRIMARY KEY ("lesson_id")`,
        );
        await queryRunner.query(
            `ALTER TABLE "lesson_dependencies" DROP COLUMN "prerequisite_id"`,
        );
        await queryRunner.query(
            `ALTER TABLE "lesson_dependencies" DROP CONSTRAINT "PK_0a25bce110e9e1c7732422e9858"`,
        );
        await queryRunner.query(
            `ALTER TABLE "lesson_dependencies" DROP COLUMN "lesson_id"`,
        );
        await queryRunner.query(
            `ALTER TABLE "lesson_dependencies" ADD "lesson_id_2" uuid NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE "lesson_dependencies" ADD CONSTRAINT "PK_eb0ee519dea180d7dd4f904b0bc" PRIMARY KEY ("lesson_id_2")`,
        );
        await queryRunner.query(
            `ALTER TABLE "lesson_dependencies" ADD "lesson_id_1" uuid NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE "lesson_dependencies" DROP CONSTRAINT "PK_eb0ee519dea180d7dd4f904b0bc"`,
        );
        await queryRunner.query(
            `ALTER TABLE "lesson_dependencies" ADD CONSTRAINT "PK_2c898f640a09ab0d1986f455af6" PRIMARY KEY ("lesson_id_1", "lesson_id_2")`,
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_eb0ee519dea180d7dd4f904b0b" ON "lesson_dependencies" ("lesson_id_2") `,
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_6f959bb0f47a360bde2dc6d742" ON "lesson_dependencies" ("lesson_id_1") `,
        );
        await queryRunner.query(
            `ALTER TABLE "lesson_dependencies" ADD CONSTRAINT "FK_eb0ee519dea180d7dd4f904b0bc" FOREIGN KEY ("lesson_id_2") REFERENCES "lesson"("uuid") ON DELETE CASCADE ON UPDATE CASCADE`,
        );
        await queryRunner.query(
            `ALTER TABLE "lesson_dependencies" ADD CONSTRAINT "FK_6f959bb0f47a360bde2dc6d7428" FOREIGN KEY ("lesson_id_1") REFERENCES "lesson"("uuid") ON DELETE CASCADE ON UPDATE CASCADE`,
        );
    }
}
