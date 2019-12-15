import { MigrationInterface, QueryRunner } from 'typeorm';

export class Location1575816827867 implements MigrationInterface {
  name = 'Location1575816827867';

  public async up(queryRunner: QueryRunner): Promise<any> {
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
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP TABLE "locations"`, undefined);
  }
}
