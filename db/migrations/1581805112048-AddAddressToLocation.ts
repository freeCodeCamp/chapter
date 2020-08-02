import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAddressToLocation1581805112048 implements MigrationInterface {
  name = 'AddAddressToLocation1581805112048';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "locations" ADD "address" character varying`, undefined);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "locations" DROP COLUMN "address"`, undefined);
  }
}
