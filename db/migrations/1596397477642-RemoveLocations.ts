import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveLocations1596397477642 implements MigrationInterface {
  name = 'RemoveLocations1596397477642';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "locations"`);
    await queryRunner.query(`ALTER TABLE "venues" DROP CONSTRAINT "FK_937d4cf54512864b1a842482c13"`);
    await queryRunner.query(`ALTER TABLE "chapters" DROP CONSTRAINT "FK_95d978cb93804fa26283d6741cf"`);
    await queryRunner.query(`ALTER TABLE "venues" DROP COLUMN "location_id"`);
    await queryRunner.query(`ALTER TABLE "chapters" DROP COLUMN "location_id"`);
    await queryRunner.query(`ALTER TABLE "venues" ADD "street_address" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "venues" ADD "city" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "venues" ADD "postal_code" integer NOT NULL`);
    await queryRunner.query(`ALTER TABLE "venues" ADD "region" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "venues" ADD "country" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "venues" ADD "latitude" double precision`);
    await queryRunner.query(`ALTER TABLE "venues" ADD "longitude" double precision`);
    await queryRunner.query(`ALTER TABLE "chapters" ADD "city" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "chapters" ADD "region" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "chapters" ADD "country" character varying NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "locations" (
            "id" SERIAL NOT NULL,
            "country_code" character varying NOT NULL,
            "city" character varying NOT NULL,
            "region" character varying NOT NULL,
            "postal_code" character varying NOT NULL,
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "PK_7cc1c9e3853b94816c094825e74" PRIMARY KEY ("id"))`,
      undefined,
    );
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
    await queryRunner.query(`ALTER TABLE "chapters" ADD "location_id" integer`);
    await queryRunner.query(`ALTER TABLE "venues" ADD "location_id" integer NOT NULL`);
    await queryRunner.query(`ALTER TABLE "chapters" ADD CONSTRAINT "FK_95d978cb93804fa26283d6741cf" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "venues" ADD CONSTRAINT "FK_937d4cf54512864b1a842482c13" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }
}
