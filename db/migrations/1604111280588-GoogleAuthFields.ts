import { MigrationInterface, QueryRunner } from 'typeorm';

export class GoogleAuthFields1604111280588 implements MigrationInterface {
  name = 'GoogleAuthFields1604111280588';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD "google_id" character varying DEFAULT NULL`);
    await queryRunner.query(`ALTER TABLE "users" ADD "google_picture" character varying DEFAULT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "google_id"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "google_picture"`);
  }
}
