import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOrganizerToEvent1624615994288 implements MigrationInterface {
  name = 'AddOrganizerToEvent1624615994288';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "events" ADD "organizer_id" integer`);
    await queryRunner.query(`ALTER TABLE "events" ADD CONSTRAINT "FK_14c9ce53a2c2a1c781b8390123e" FOREIGN KEY ("organizer_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "events" DROP CONSTRAINT "FK_14c9ce53a2c2a1c781b8390123e"`);
    await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "organizer_id"`);
  }
}
