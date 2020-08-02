import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveChapterUser1595424588635 implements MigrationInterface {
  name = 'RemoveChapterUser1595424588635';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "user_chapter_roles" ADD "interested" boolean NOT NULL`, undefined);
    await queryRunner.query(`ALTER TABLE "user_chapter_roles" DROP CONSTRAINT "PK_d4726976f7c0d644f1a01cebe6d"`, undefined);
    await queryRunner.query(`ALTER TABLE "user_chapter_roles" ADD CONSTRAINT "PK_e18f99bd3676bd6ff32cc045d2b" PRIMARY KEY ("user_id", "chapter_id")`, undefined);
    await queryRunner.query(`ALTER TABLE "user_chapter_roles" DROP COLUMN "role_name"`, undefined);
    await queryRunner.query(`ALTER TABLE "user_chapter_roles" ADD "role_name" text NOT NULL`, undefined);
    await queryRunner.query(`ALTER TABLE "user_chapter_roles" DROP CONSTRAINT "PK_e18f99bd3676bd6ff32cc045d2b"`, undefined);
    await queryRunner.query(`ALTER TABLE "user_chapter_roles" ADD CONSTRAINT "PK_d4726976f7c0d644f1a01cebe6d" PRIMARY KEY ("user_id", "chapter_id", "role_name")`, undefined);
    await queryRunner.query(`ALTER TABLE "user_instance_roles" DROP CONSTRAINT "PK_a6668338a373b7a8d914a193f3f"`, undefined);
    await queryRunner.query(`ALTER TABLE "user_instance_roles" ADD CONSTRAINT "PK_f6aa9d1d5bffdd18382d18729d0" PRIMARY KEY ("user_id")`, undefined);
    await queryRunner.query(`ALTER TABLE "user_instance_roles" DROP COLUMN "role_name"`, undefined);
    await queryRunner.query(`ALTER TABLE "user_instance_roles" ADD "role_name" text NOT NULL`, undefined);
    await queryRunner.query(`ALTER TABLE "user_instance_roles" DROP CONSTRAINT "PK_f6aa9d1d5bffdd18382d18729d0"`, undefined);
    await queryRunner.query(`ALTER TABLE "user_instance_roles" ADD CONSTRAINT "PK_a6668338a373b7a8d914a193f3f" PRIMARY KEY ("user_id", "role_name")`, undefined);
    await queryRunner.query(`ALTER TABLE "rsvps" ALTER COLUMN "canceled" DROP DEFAULT`, undefined);
    await queryRunner.query(`ALTER TABLE "rsvps" ALTER COLUMN "interested" DROP DEFAULT`, undefined);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "rsvps" ALTER COLUMN "interested" SET DEFAULT true`, undefined);
    await queryRunner.query(`ALTER TABLE "rsvps" ALTER COLUMN "canceled" SET DEFAULT false`, undefined);
    await queryRunner.query(`ALTER TABLE "user_instance_roles" DROP CONSTRAINT "PK_a6668338a373b7a8d914a193f3f"`, undefined);
    await queryRunner.query(`ALTER TABLE "user_instance_roles" ADD CONSTRAINT "PK_f6aa9d1d5bffdd18382d18729d0" PRIMARY KEY ("user_id")`, undefined);
    await queryRunner.query(`ALTER TABLE "user_instance_roles" DROP COLUMN "role_name"`, undefined);
    await queryRunner.query(`ALTER TABLE "user_instance_roles" ADD "role_name" character varying NOT NULL`, undefined);
    await queryRunner.query(`ALTER TABLE "user_instance_roles" DROP CONSTRAINT "PK_f6aa9d1d5bffdd18382d18729d0"`, undefined);
    await queryRunner.query(`ALTER TABLE "user_instance_roles" ADD CONSTRAINT "PK_a6668338a373b7a8d914a193f3f" PRIMARY KEY ("user_id", "role_name")`, undefined);
    await queryRunner.query(`ALTER TABLE "user_chapter_roles" DROP CONSTRAINT "PK_d4726976f7c0d644f1a01cebe6d"`, undefined);
    await queryRunner.query(`ALTER TABLE "user_chapter_roles" ADD CONSTRAINT "PK_e18f99bd3676bd6ff32cc045d2b" PRIMARY KEY ("user_id", "chapter_id")`, undefined);
    await queryRunner.query(`ALTER TABLE "user_chapter_roles" DROP COLUMN "role_name"`, undefined);
    await queryRunner.query(`ALTER TABLE "user_chapter_roles" ADD "role_name" character varying NOT NULL`, undefined);
    await queryRunner.query(`ALTER TABLE "user_chapter_roles" DROP CONSTRAINT "PK_e18f99bd3676bd6ff32cc045d2b"`, undefined);
    await queryRunner.query(`ALTER TABLE "user_chapter_roles" ADD CONSTRAINT "PK_d4726976f7c0d644f1a01cebe6d" PRIMARY KEY ("user_id", "chapter_id", "role_name")`, undefined);
    await queryRunner.query(`ALTER TABLE "user_chapter_roles" DROP COLUMN "interested"`, undefined);
  }
}
