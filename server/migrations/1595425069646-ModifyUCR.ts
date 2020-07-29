import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyUCR1595425069646 implements MigrationInterface {
  name = 'ModifyUCR1595425069646';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "user_chapter_roles" ADD "id" SERIAL NOT NULL`, undefined);
    await queryRunner.query(`ALTER TABLE "user_chapter_roles" DROP CONSTRAINT "PK_d4726976f7c0d644f1a01cebe6d"`, undefined);
    await queryRunner.query(`ALTER TABLE "user_chapter_roles" ADD CONSTRAINT "PK_41033d3ee61995e854787fc7230" PRIMARY KEY ("user_id", "chapter_id", "role_name", "id")`, undefined);
    await queryRunner.query(`ALTER TABLE "user_chapter_roles" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`, undefined);
    await queryRunner.query(`ALTER TABLE "user_chapter_roles" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`, undefined);
    await queryRunner.query(`ALTER TABLE "user_chapter_roles" ADD "interested" boolean NOT NULL`, undefined);
    await queryRunner.query(`ALTER TABLE "user_chapter_roles" DROP CONSTRAINT "PK_41033d3ee61995e854787fc7230"`, undefined);
    await queryRunner.query(`ALTER TABLE "user_chapter_roles" ADD CONSTRAINT "PK_9daf4841d7ac950bb3c511ad5f2" PRIMARY KEY ("user_id", "chapter_id", "id")`, undefined);
    await queryRunner.query(`ALTER TABLE "user_chapter_roles" DROP COLUMN "role_name"`, undefined);
    await queryRunner.query(`ALTER TABLE "user_chapter_roles" ADD "role_name" text NOT NULL`, undefined);
    await queryRunner.query(`ALTER TABLE "user_chapter_roles" DROP CONSTRAINT "PK_9daf4841d7ac950bb3c511ad5f2"`, undefined);
    await queryRunner.query(`ALTER TABLE "user_chapter_roles" ADD CONSTRAINT "PK_41033d3ee61995e854787fc7230" PRIMARY KEY ("user_id", "chapter_id", "id", "role_name")`, undefined);
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
    await queryRunner.query(`ALTER TABLE "user_chapter_roles" DROP CONSTRAINT "PK_41033d3ee61995e854787fc7230"`, undefined);
    await queryRunner.query(`ALTER TABLE "user_chapter_roles" ADD CONSTRAINT "PK_9daf4841d7ac950bb3c511ad5f2" PRIMARY KEY ("user_id", "chapter_id", "id")`, undefined);
    await queryRunner.query(`ALTER TABLE "user_chapter_roles" DROP COLUMN "role_name"`, undefined);
    await queryRunner.query(`ALTER TABLE "user_chapter_roles" ADD "role_name" character varying NOT NULL`, undefined);
    await queryRunner.query(`ALTER TABLE "user_chapter_roles" DROP CONSTRAINT "PK_9daf4841d7ac950bb3c511ad5f2"`, undefined);
    await queryRunner.query(`ALTER TABLE "user_chapter_roles" ADD CONSTRAINT "PK_41033d3ee61995e854787fc7230" PRIMARY KEY ("user_id", "chapter_id", "role_name", "id")`, undefined);
    await queryRunner.query(`ALTER TABLE "user_chapter_roles" DROP COLUMN "interested"`, undefined);
    await queryRunner.query(`ALTER TABLE "user_chapter_roles" DROP COLUMN "updated_at"`, undefined);
    await queryRunner.query(`ALTER TABLE "user_chapter_roles" DROP COLUMN "created_at"`, undefined);
    await queryRunner.query(`ALTER TABLE "user_chapter_roles" DROP CONSTRAINT "PK_41033d3ee61995e854787fc7230"`, undefined);
    await queryRunner.query(`ALTER TABLE "user_chapter_roles" ADD CONSTRAINT "PK_d4726976f7c0d644f1a01cebe6d" PRIMARY KEY ("user_id", "chapter_id", "role_name")`, undefined);
    await queryRunner.query(`ALTER TABLE "user_chapter_roles" DROP COLUMN "id"`, undefined);
  }
}
