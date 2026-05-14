import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedXpToUserAndLesson1778680912031 implements MigrationInterface {
    name = 'AddedXpToUserAndLesson1778680912031';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "lessons" ADD "xp" integer NOT NULL DEFAULT '0'`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lessons" DROP COLUMN "xp"`);
    }
}
