import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEventImage1625060737729 implements MigrationInterface {
  name = 'AddEventImage1625060737729';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "events" ADD "image" character varying NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "image"`);
  }
}
