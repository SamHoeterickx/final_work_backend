import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTranslationsToChapter1779265293165 implements MigrationInterface {
    name = 'AddTranslationsToChapter1779265293165';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chapters" DROP COLUMN "name"`);
        await queryRunner.query(
            `ALTER TABLE "chapters" ADD "name" jsonb NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE "chapters" DROP COLUMN "description"`,
        );
        await queryRunner.query(
            `ALTER TABLE "chapters" ADD "description" jsonb NOT NULL`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "chapters" DROP COLUMN "description"`,
        );
        await queryRunner.query(
            `ALTER TABLE "chapters" ADD "description" character varying NOT NULL`,
        );
        await queryRunner.query(`ALTER TABLE "chapters" DROP COLUMN "name"`);
        await queryRunner.query(
            `ALTER TABLE "chapters" ADD "name" character varying NOT NULL`,
        );
    }
}
