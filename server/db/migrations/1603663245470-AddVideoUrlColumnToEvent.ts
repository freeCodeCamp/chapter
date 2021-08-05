import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddVideoUrlColumnToEvent1603663245470 implements MigrationInterface {
  name = 'AddVideoUrlColumnToEvent1603663245470';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "events" ADD "video_url" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "video_url"`);
  }
}
