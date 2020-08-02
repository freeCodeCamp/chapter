import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddInterestedColumnToUserChapter1584377249878 implements MigrationInterface {
  name = 'AddInterestedColumnToUserChapter1584377249878';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "user_chapters" ADD "interested" BOOLEAN NOT NULL DEFAULT TRUE`, undefined);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "user_chapters" DROP COLUMN "interested"`, undefined);
  }
}
