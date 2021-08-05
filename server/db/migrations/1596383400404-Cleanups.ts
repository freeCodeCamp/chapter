import { MigrationInterface, QueryRunner } from 'typeorm';

export class Cleanups1596383400404 implements MigrationInterface {
  name = 'Cleanups1596383400404';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_chapter_roles" ADD "id" SERIAL NOT NULL`);
    await queryRunner.query(`ALTER TABLE "user_chapter_roles" DROP CONSTRAINT "PK_d4726976f7c0d644f1a01cebe6d"`);
    await queryRunner.query(`ALTER TABLE "user_chapter_roles" ADD CONSTRAINT "PK_41033d3ee61995e854787fc7230" PRIMARY KEY ("user_id", "chapter_id", "role_name", "id")`);
    await queryRunner.query(`ALTER TABLE "user_chapter_roles" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "user_chapter_roles" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "user_chapter_roles" ADD "interested" boolean NOT NULL`);
    await queryRunner.query(`ALTER TABLE "user_chapter_roles" DROP CONSTRAINT "PK_41033d3ee61995e854787fc7230"`);
    await queryRunner.query(`ALTER TABLE "user_chapter_roles" ADD CONSTRAINT "PK_9daf4841d7ac950bb3c511ad5f2" PRIMARY KEY ("user_id", "chapter_id", "id")`);
    await queryRunner.query(`ALTER TABLE "user_chapter_roles" DROP COLUMN "role_name"`);
    await queryRunner.query(`ALTER TABLE "user_chapter_roles" ADD "role_name" text NOT NULL`);
    await queryRunner.query(`ALTER TABLE "user_chapter_roles" DROP CONSTRAINT "PK_9daf4841d7ac950bb3c511ad5f2"`);
    await queryRunner.query(`ALTER TABLE "user_chapter_roles" ADD CONSTRAINT "PK_41033d3ee61995e854787fc7230" PRIMARY KEY ("user_id", "chapter_id", "id", "role_name")`);
    await queryRunner.query(`ALTER TABLE "user_instance_roles" DROP CONSTRAINT "PK_a6668338a373b7a8d914a193f3f"`);
    await queryRunner.query(`ALTER TABLE "user_instance_roles" ADD CONSTRAINT "PK_f6aa9d1d5bffdd18382d18729d0" PRIMARY KEY ("user_id")`);
    await queryRunner.query(`ALTER TABLE "user_instance_roles" DROP COLUMN "role_name"`);
    await queryRunner.query(`ALTER TABLE "user_instance_roles" ADD "role_name" text NOT NULL`);
    await queryRunner.query(`ALTER TABLE "user_instance_roles" DROP CONSTRAINT "PK_f6aa9d1d5bffdd18382d18729d0"`);
    await queryRunner.query(`ALTER TABLE "user_instance_roles" ADD CONSTRAINT "PK_a6668338a373b7a8d914a193f3f" PRIMARY KEY ("user_id", "role_name")`);
    await queryRunner.query(`ALTER TABLE "rsvps" ALTER COLUMN "canceled" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "rsvps" ALTER COLUMN "interested" DROP DEFAULT`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "rsvps" ALTER COLUMN "interested" SET DEFAULT true`);
    await queryRunner.query(`ALTER TABLE "rsvps" ALTER COLUMN "canceled" SET DEFAULT false`);
    await queryRunner.query(`ALTER TABLE "user_instance_roles" DROP CONSTRAINT "PK_a6668338a373b7a8d914a193f3f"`);
    await queryRunner.query(`ALTER TABLE "user_instance_roles" ADD CONSTRAINT "PK_f6aa9d1d5bffdd18382d18729d0" PRIMARY KEY ("user_id")`);
    await queryRunner.query(`ALTER TABLE "user_instance_roles" DROP COLUMN "role_name"`);
    await queryRunner.query(`ALTER TABLE "user_instance_roles" ADD "role_name" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "user_instance_roles" DROP CONSTRAINT "PK_f6aa9d1d5bffdd18382d18729d0"`);
    await queryRunner.query(`ALTER TABLE "user_instance_roles" ADD CONSTRAINT "PK_a6668338a373b7a8d914a193f3f" PRIMARY KEY ("user_id", "role_name")`);
    await queryRunner.query(`ALTER TABLE "user_chapter_roles" DROP CONSTRAINT "PK_41033d3ee61995e854787fc7230"`);
    await queryRunner.query(`ALTER TABLE "user_chapter_roles" ADD CONSTRAINT "PK_9daf4841d7ac950bb3c511ad5f2" PRIMARY KEY ("user_id", "chapter_id", "id")`);
    await queryRunner.query(`ALTER TABLE "user_chapter_roles" DROP COLUMN "role_name"`);
    await queryRunner.query(`ALTER TABLE "user_chapter_roles" ADD "role_name" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "user_chapter_roles" DROP CONSTRAINT "PK_9daf4841d7ac950bb3c511ad5f2"`);
    await queryRunner.query(`ALTER TABLE "user_chapter_roles" ADD CONSTRAINT "PK_41033d3ee61995e854787fc7230" PRIMARY KEY ("user_id", "chapter_id", "role_name", "id")`);
    await queryRunner.query(`ALTER TABLE "user_chapter_roles" DROP COLUMN "interested"`);
    await queryRunner.query(`ALTER TABLE "user_chapter_roles" DROP COLUMN "updated_at"`);
    await queryRunner.query(`ALTER TABLE "user_chapter_roles" DROP COLUMN "created_at"`);
    await queryRunner.query(`ALTER TABLE "user_chapter_roles" DROP CONSTRAINT "PK_41033d3ee61995e854787fc7230"`);
    await queryRunner.query(`ALTER TABLE "user_chapter_roles" ADD CONSTRAINT "PK_d4726976f7c0d644f1a01cebe6d" PRIMARY KEY ("user_id", "chapter_id", "role_name")`);
    await queryRunner.query(`ALTER TABLE "user_chapter_roles" DROP COLUMN "id"`);
  }
}
