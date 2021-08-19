import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCanceledColumnToRsvp1584377551030 implements MigrationInterface {
  name = 'AddCanceledColumnToRsvp1584377551030';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "rsvps" ADD "canceled" BOOLEAN NOT NULL DEFAULT FALSE`, undefined);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "rsvps" DROP COLUMN "canceled"`, undefined);
  }
}
