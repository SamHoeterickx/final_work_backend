import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChapterSlug1778229317600 implements MigrationInterface {
    name = 'ChapterSlug1778229317600';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "chapters" ADD "slug" character varying NOT NULL`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chapters" DROP COLUMN "slug"`);
    }
}
