import { MigrationInterface, QueryRunner } from 'typeorm';

export class Venue1575816971375 implements MigrationInterface {
  name = 'Venue1575816971375';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "venues" (
        "id" SERIAL NOT NULL, 
        "name" character varying NOT NULL, 
        "location_id" integer, 
        "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
        CONSTRAINT "PK_cb0f885278d12384eb7a81818be" PRIMARY KEY ("id"))`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "venues" ADD CONSTRAINT "FK_937d4cf54512864b1a842482c13" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "venues" DROP CONSTRAINT "FK_937d4cf54512864b1a842482c13"`,
      undefined,
    );
    await queryRunner.query(`DROP TABLE "venues"`, undefined);
  }
}
