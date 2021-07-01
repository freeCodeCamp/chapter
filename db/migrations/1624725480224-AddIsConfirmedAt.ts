import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsConfirmedAt1624725480224 implements MigrationInterface {
  name = 'AddIsConfirmedAt1624725480224';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "rsvps" ADD "confirmed_at" TIMESTAMP`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "rsvps" DROP COLUMN "confirmed_at"`);
  }
}
