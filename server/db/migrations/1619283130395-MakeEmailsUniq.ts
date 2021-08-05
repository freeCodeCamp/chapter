import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeEmailsUniq1619283130395 implements MigrationInterface {
  name = 'MakeEmailsUniq1619283130395';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email")`);
    await queryRunner.query(`ALTER TYPE "events_venue_type_enum" RENAME TO "events_venue_type_enum_old"`);
    await queryRunner.query(`CREATE TYPE "events_venue_type_enum" AS ENUM('Physical', 'Online', 'PhysicalAndOnline')`);
    await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "venue_type" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "venue_type" TYPE "events_venue_type_enum" USING "venue_type"::"text"::"events_venue_type_enum"`);
    await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "venue_type" SET DEFAULT 'Physical'`);
    await queryRunner.query(`DROP TYPE "events_venue_type_enum_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "events_venue_type_enum_old" AS ENUM('Physical', 'Online', 'Physical and Online')`);
    await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "venue_type" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "venue_type" TYPE "events_venue_type_enum_old" USING "venue_type"::"text"::"events_venue_type_enum_old"`);
    await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "venue_type" SET DEFAULT 'Physical'`);
    await queryRunner.query(`DROP TYPE "events_venue_type_enum"`);
    await queryRunner.query(`ALTER TYPE "events_venue_type_enum_old" RENAME TO "events_venue_type_enum"`);
    await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3"`);
  }
}
