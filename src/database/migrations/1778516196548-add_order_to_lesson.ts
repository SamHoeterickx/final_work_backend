import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOrderToLesson1778516196548 implements MigrationInterface {
    name = 'AddOrderToLesson1778516196548'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lessons" ADD "order" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lessons" DROP COLUMN "order"`);
    }

}
