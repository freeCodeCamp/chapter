import { MigrationInterface, QueryRunner } from 'typeorm';

export class Event1575818350511 implements MigrationInterface {
  name = 'Event1575818350511';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "events" (
          "id" SERIAL NOT NULL, 
          "name" character varying NOT NULL, 
          "description" character varying NOT NULL, 
          "start_at" TIMESTAMP NOT NULL, "ends_at" TIMESTAMP NOT NULL, 
          "canceled" boolean NOT NULL DEFAULT false, 
          "capacity" integer NOT NULL, 
          "venue_id" integer, 
          "chapter_id" integer, 
          "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
          "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
          CONSTRAINT "PK_40731c7151fe4be3116e45ddf73" PRIMARY KEY ("id"))`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "events" ADD CONSTRAINT "FK_26e10dc1ae5cdd5a20279e08b4a" FOREIGN KEY ("venue_id") REFERENCES "venues"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "events" ADD CONSTRAINT "FK_987a4efcef7b92bd79e1071719d" FOREIGN KEY ("chapter_id") REFERENCES "chapters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "events" DROP CONSTRAINT "FK_987a4efcef7b92bd79e1071719d"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "events" DROP CONSTRAINT "FK_26e10dc1ae5cdd5a20279e08b4a"`,
      undefined,
    );
    await queryRunner.query(`DROP TABLE "events"`, undefined);
  }
}
