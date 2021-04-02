import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddVenueTypeColumnToEvent1603750378987 implements MigrationInterface {
  name = 'AddVenueTypeColumnToEvent1603750378987';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "events_venue_type_enum" AS ENUM('Physical', 'Online', 'Physical and Online')`);
    await queryRunner.query(`ALTER TABLE "events" ADD "venue_type" "events_venue_type_enum" NOT NULL DEFAULT 'Physical'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "venue_type"`);
    await queryRunner.query(`DROP TYPE "events_venue_type_enum"`);
  }
}
