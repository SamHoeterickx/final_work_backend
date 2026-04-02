import { MigrationInterface, QueryRunner } from 'typeorm';

export class SlugForChapterAndLesson1775053201503 implements MigrationInterface {
    name = 'SlugForChapterAndLesson1775053201503';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "chapter" ADD "slug" character varying NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE "lesson" ADD "slug" character varying NOT NULL`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lesson" DROP COLUMN "slug"`);
        await queryRunner.query(`ALTER TABLE "chapter" DROP COLUMN "slug"`);
    }
}
