import { MigrationInterface, QueryRunner } from 'typeorm';

export class Rsvp1575818471163 implements MigrationInterface {
  name = 'Rsvp1575818471163';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "rsvps" (
          "id" SERIAL NOT NULL, 
          "date" TIMESTAMP NOT NULL, 
          "on_waitlist" boolean NOT NULL, 
          "event_id" integer, 
          "user_id" integer, 
          "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
          "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
          CONSTRAINT "PK_5d5dda5a5f9fc2f6ba17eefbf86" PRIMARY KEY ("id"))`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "rsvps" ADD CONSTRAINT "FK_04d52fc9fe91004aa1860603ea3" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "rsvps" ADD CONSTRAINT "FK_5ef6c963e9f7d98f6e0f79053a3" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "rsvps" DROP CONSTRAINT "FK_5ef6c963e9f7d98f6e0f79053a3"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "rsvps" DROP CONSTRAINT "FK_04d52fc9fe91004aa1860603ea3"`,
      undefined,
    );
    await queryRunner.query(`DROP TABLE "rsvps"`, undefined);
  }
}
