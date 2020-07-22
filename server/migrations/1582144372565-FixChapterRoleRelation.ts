import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixChapterRoleRelation1582144372565 implements MigrationInterface {
  name = 'FixChapterRoleRelation1582144372565';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "user_chapter_roles" DROP CONSTRAINT "FK_c4b23ce3d811d599cea97d064fc"`, undefined);
    await queryRunner.query(`ALTER TABLE "user_chapter_roles" ADD CONSTRAINT "FK_b118ecdd67565f94b2a2e23d94d" FOREIGN KEY ("chapter_id") REFERENCES "chapters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "user_chapter_roles" DROP CONSTRAINT "FK_b118ecdd67565f94b2a2e23d94d"`, undefined);
    await queryRunner.query(`ALTER TABLE "user_chapter_roles" ADD CONSTRAINT "FK_c4b23ce3d811d599cea97d064fc" FOREIGN KEY ("chapter_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
  }
}
