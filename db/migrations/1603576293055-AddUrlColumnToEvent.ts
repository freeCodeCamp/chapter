import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUrlColumnToEvent1603576293055 implements MigrationInterface {
  name = 'AddUrlColumnToEvent1603576293055';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "events" ADD "url" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "url"`);
  }
}
