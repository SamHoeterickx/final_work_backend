import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserProfile1774539724865 implements MigrationInterface {
    name = 'UserProfile1774539724865';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "user_profiles" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "currentBehaviour" text array NOT NULL, "experienceLevel" character varying NOT NULL, "goals" text array NOT NULL, "currentPreference" character varying NOT NULL, "desiredTempo" character varying NOT NULL, "currentMethodes" text array NOT NULL, "extraGear" text array NOT NULL, "fullOnboardingData" jsonb NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "userUuid" uuid, CONSTRAINT "REL_b95d23376e021671f5806dd5f3" UNIQUE ("userUuid"), CONSTRAINT "PK_040865f172e05ac6714fc915b60" PRIMARY KEY ("uuid"))`,
        );
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "lastname"`);
        await queryRunner.query(
            `ALTER TABLE "users" ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email")`,
        );
        await queryRunner.query(
            `ALTER TABLE "user_profiles" ADD CONSTRAINT "FK_b95d23376e021671f5806dd5f3a" FOREIGN KEY ("userUuid") REFERENCES "users"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "user_profiles" DROP CONSTRAINT "FK_b95d23376e021671f5806dd5f3a"`,
        );
        await queryRunner.query(
            `ALTER TABLE "users" DROP CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3"`,
        );
        await queryRunner.query(
            `ALTER TABLE "users" ADD "lastname" character varying NOT NULL`,
        );
        await queryRunner.query(`DROP TABLE "user_profiles"`);
    }
}
