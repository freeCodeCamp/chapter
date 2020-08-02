import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLocationFieldsToDB1596398030640 implements MigrationInterface {
  name = 'AddLocationFieldsToDB1596398030640';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "venues" ADD "street_address" character varying`);
    await queryRunner.query(`ALTER TABLE "venues" ADD "city" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "venues" ADD "postal_code" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "venues" ADD "region" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "venues" ADD "country" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "venues" ADD "latitude" double precision`);
    await queryRunner.query(`ALTER TABLE "venues" ADD "longitude" double precision`);
    await queryRunner.query(`ALTER TABLE "chapters" ADD "city" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "chapters" ADD "region" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "chapters" ADD "country" character varying NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "chapters" DROP COLUMN "country"`);
    await queryRunner.query(`ALTER TABLE "chapters" DROP COLUMN "region"`);
    await queryRunner.query(`ALTER TABLE "chapters" DROP COLUMN "city"`);
    await queryRunner.query(`ALTER TABLE "venues" DROP COLUMN "longitude"`);
    await queryRunner.query(`ALTER TABLE "venues" DROP COLUMN "latitude"`);
    await queryRunner.query(`ALTER TABLE "venues" DROP COLUMN "country"`);
    await queryRunner.query(`ALTER TABLE "venues" DROP COLUMN "region"`);
    await queryRunner.query(`ALTER TABLE "venues" DROP COLUMN "postal_code"`);
    await queryRunner.query(`ALTER TABLE "venues" DROP COLUMN "city"`);
    await queryRunner.query(`ALTER TABLE "venues" DROP COLUMN "street_address"`);
  }
}
