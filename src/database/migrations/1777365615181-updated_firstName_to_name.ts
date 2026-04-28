import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatedFirstNameToName1777365615181 implements MigrationInterface {
    name = 'UpdatedFirstNameToName1777365615181'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "firstname" TO "name"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "name" TO "firstname"`);
    }

}
