import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserRoles1581584876652 implements MigrationInterface {
  name = 'UserRoles1581584876652';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`CREATE TABLE "user_chapter_roles" ("user_id" integer NOT NULL, "chapter_id" integer NOT NULL, "role_name" character varying NOT NULL, CONSTRAINT "PK_d4726976f7c0d644f1a01cebe6d" PRIMARY KEY ("user_id", "chapter_id", "role_name"))`, undefined);
    await queryRunner.query(`CREATE TABLE "user_instance_roles" ("user_id" integer NOT NULL, "role_name" character varying NOT NULL, CONSTRAINT "PK_a6668338a373b7a8d914a193f3f" PRIMARY KEY ("user_id", "role_name"))`, undefined);
    await queryRunner.query(`ALTER TABLE "user_chapter_roles" ADD CONSTRAINT "FK_dff88cec5f2df9a6e9d9a7af03e" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    await queryRunner.query(`ALTER TABLE "user_chapter_roles" ADD CONSTRAINT "FK_c4b23ce3d811d599cea97d064fc" FOREIGN KEY ("chapter_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    await queryRunner.query(`ALTER TABLE "user_instance_roles" ADD CONSTRAINT "FK_f6aa9d1d5bffdd18382d18729d0" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "user_instance_roles" DROP CONSTRAINT "FK_f6aa9d1d5bffdd18382d18729d0"`, undefined);
    await queryRunner.query(`ALTER TABLE "user_chapter_roles" DROP CONSTRAINT "FK_c4b23ce3d811d599cea97d064fc"`, undefined);
    await queryRunner.query(`ALTER TABLE "user_chapter_roles" DROP CONSTRAINT "FK_dff88cec5f2df9a6e9d9a7af03e"`, undefined);
    await queryRunner.query(`DROP TABLE "user_instance_roles"`, undefined);
    await queryRunner.query(`DROP TABLE "user_chapter_roles"`, undefined);
  }
}
