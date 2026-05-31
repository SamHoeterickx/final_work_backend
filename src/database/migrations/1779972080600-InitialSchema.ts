import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1779972080600 implements MigrationInterface {
    name = 'InitialSchema1779972080600'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "chapters" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" jsonb NOT NULL, "slug" character varying NOT NULL, "description" jsonb NOT NULL, "tags" text array NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_af9c9ecbe2e5d87eecc4f9128f1" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`CREATE TYPE "public"."lesson_translations_languagecode_enum" AS ENUM('nl', 'fr', 'en')`);
        await queryRunner.query(`CREATE TABLE "lesson_translations" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "languageCode" "public"."lesson_translations_languagecode_enum" NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "content" jsonb NOT NULL, "lessonUuid" uuid, CONSTRAINT "PK_e92c5813bce5498e5089786e111" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`CREATE TABLE "lessons" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "estimatedDuration" integer NOT NULL, "xp" integer NOT NULL DEFAULT '0', "order" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "chapterUuid" uuid, CONSTRAINT "PK_67edbf998244ca30b18a280c9a9" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`CREATE TABLE "user_streaks" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "currentStreak" integer NOT NULL DEFAULT '0', "longestStreak" integer NOT NULL DEFAULT '0', "lastCompletedDate" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "userUuid" uuid, CONSTRAINT "REL_838ed7822ff75adcb6c02df10b" UNIQUE ("userUuid"), CONSTRAINT "PK_f6af4d85f791422060aca45f2de" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('ADMIN', 'USER')`);
        await queryRunner.query(`CREATE TYPE "public"."users_language_enum" AS ENUM('nl', 'fr', 'en')`);
        await queryRunner.query(`CREATE TABLE "users" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'USER', "xp" integer NOT NULL DEFAULT '0', "passwordResetCode" character varying, "passwordResetExpires" TIMESTAMP, "currentHashedRefreshToken" character varying, "language" "public"."users_language_enum" NOT NULL DEFAULT 'en', "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_951b8f1dfc94ac1d0301a14b7e1" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`CREATE TYPE "public"."lesson_user_status_enum" AS ENUM('LOCKED', 'UNLOCKED', 'IN_PROGRESS', 'COMPLETED')`);
        await queryRunner.query(`CREATE TABLE "lesson_user" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" "public"."lesson_user_status_enum" NOT NULL DEFAULT 'LOCKED', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "userUuid" uuid, "lessonUuid" uuid, CONSTRAINT "PK_76f265068ebde54e969c40d46f3" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`CREATE TYPE "public"."chapter_user_status_enum" AS ENUM('LOCKED', 'UNLOCKED', 'IN_PROGRESS', 'COMPLETED')`);
        await queryRunner.query(`CREATE TABLE "chapter_user" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" "public"."chapter_user_status_enum" NOT NULL DEFAULT 'LOCKED', "order" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "userUuid" uuid, "chapterUuid" uuid, CONSTRAINT "PK_b7ea37d5c62e198e2a72994205d" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`CREATE TABLE "user_profiles" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "currentBehaviour" text array NOT NULL, "experienceLevel" character varying NOT NULL, "goal" text NOT NULL, "currentPreference" character varying NOT NULL, "desiredTempo" character varying NOT NULL, "currentMethodes" text array, "extraGear" text array, "fullOnboardingData" jsonb, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "userUuid" uuid, CONSTRAINT "REL_b95d23376e021671f5806dd5f3" UNIQUE ("userUuid"), CONSTRAINT "PK_040865f172e05ac6714fc915b60" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`ALTER TABLE "lesson_translations" ADD CONSTRAINT "FK_9088274142cb789ce4c2b2dd8a8" FOREIGN KEY ("lessonUuid") REFERENCES "lessons"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lessons" ADD CONSTRAINT "FK_c42c79d565b26bb951cceba81f0" FOREIGN KEY ("chapterUuid") REFERENCES "chapters"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_streaks" ADD CONSTRAINT "FK_838ed7822ff75adcb6c02df10be" FOREIGN KEY ("userUuid") REFERENCES "users"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lesson_user" ADD CONSTRAINT "FK_77905c16ec38083c6e9bcfd1c95" FOREIGN KEY ("userUuid") REFERENCES "users"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lesson_user" ADD CONSTRAINT "FK_da08ec077552e095b0bdf2a6185" FOREIGN KEY ("lessonUuid") REFERENCES "lessons"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chapter_user" ADD CONSTRAINT "FK_c1ef031fe9589828ebbd448d276" FOREIGN KEY ("userUuid") REFERENCES "users"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chapter_user" ADD CONSTRAINT "FK_2d7e8ec9bbe29c782918954ff47" FOREIGN KEY ("chapterUuid") REFERENCES "chapters"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_profiles" ADD CONSTRAINT "FK_b95d23376e021671f5806dd5f3a" FOREIGN KEY ("userUuid") REFERENCES "users"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_profiles" DROP CONSTRAINT "FK_b95d23376e021671f5806dd5f3a"`);
        await queryRunner.query(`ALTER TABLE "chapter_user" DROP CONSTRAINT "FK_2d7e8ec9bbe29c782918954ff47"`);
        await queryRunner.query(`ALTER TABLE "chapter_user" DROP CONSTRAINT "FK_c1ef031fe9589828ebbd448d276"`);
        await queryRunner.query(`ALTER TABLE "lesson_user" DROP CONSTRAINT "FK_da08ec077552e095b0bdf2a6185"`);
        await queryRunner.query(`ALTER TABLE "lesson_user" DROP CONSTRAINT "FK_77905c16ec38083c6e9bcfd1c95"`);
        await queryRunner.query(`ALTER TABLE "user_streaks" DROP CONSTRAINT "FK_838ed7822ff75adcb6c02df10be"`);
        await queryRunner.query(`ALTER TABLE "lessons" DROP CONSTRAINT "FK_c42c79d565b26bb951cceba81f0"`);
        await queryRunner.query(`ALTER TABLE "lesson_translations" DROP CONSTRAINT "FK_9088274142cb789ce4c2b2dd8a8"`);
        await queryRunner.query(`DROP TABLE "user_profiles"`);
        await queryRunner.query(`DROP TABLE "chapter_user"`);
        await queryRunner.query(`DROP TYPE "public"."chapter_user_status_enum"`);
        await queryRunner.query(`DROP TABLE "lesson_user"`);
        await queryRunner.query(`DROP TYPE "public"."lesson_user_status_enum"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_language_enum"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP TABLE "user_streaks"`);
        await queryRunner.query(`DROP TABLE "lessons"`);
        await queryRunner.query(`DROP TABLE "lesson_translations"`);
        await queryRunner.query(`DROP TYPE "public"."lesson_translations_languagecode_enum"`);
        await queryRunner.query(`DROP TABLE "chapters"`);
    }

}
