import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNotNullToVenuesLocationId1584278611086 implements MigrationInterface {
  name = 'AddNotNullToVenuesLocationId1584278611086';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "venues" DROP CONSTRAINT "FK_937d4cf54512864b1a842482c13"`, undefined);
    await queryRunner.query(`ALTER TABLE "venues" ALTER COLUMN "location_id" SET NOT NULL`, undefined);
    await queryRunner.query(`ALTER TABLE "venues" ADD CONSTRAINT "FK_937d4cf54512864b1a842482c13" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "venues" DROP CONSTRAINT "FK_937d4cf54512864b1a842482c13"`, undefined);
    await queryRunner.query(`ALTER TABLE "venues" ALTER COLUMN "location_id" DROP NOT NULL`, undefined);
    await queryRunner.query(`ALTER TABLE "venues" ADD CONSTRAINT "FK_937d4cf54512864b1a842482c13" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
  }
}
