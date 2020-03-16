import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCancelledColumnToRsvp1584377551030 implements MigrationInterface {
  name = 'AddCancelledColumnToRsvp1584377551030';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "rsvps" ADD "cancelled" BOOLEAN NOT NULL`, undefined);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "rsvps" DROP COLUMN "cancelled"`, undefined);
  }
}
