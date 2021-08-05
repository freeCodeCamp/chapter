import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddInterestedColumnToRsvp1584377495896 implements MigrationInterface {
  name = 'AddInterestedColumnToRsvp1584377495896';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "rsvps" ADD "interested" BOOLEAN NOT NULL DEFAULT TRUE`, undefined);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "rsvps" DROP COLUMN "interested"`, undefined);
  }
}
