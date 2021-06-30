import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddImages1625040136762 implements MigrationInterface {
  name = 'AddImages1625040136762';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "chapters" ADD "image" character varying NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "chapters" DROP COLUMN "image"`);
  }
}
