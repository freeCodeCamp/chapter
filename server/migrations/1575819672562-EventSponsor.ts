import { MigrationInterface, QueryRunner } from 'typeorm';

export class EventSponsor1575819672562 implements MigrationInterface {
  name = 'EventSponsor1575819672562';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "event_sponsors" (
          "id" SERIAL NOT NULL, 
          "sponsor_id" integer, 
          "event_id" integer, 
          "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
          "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
          CONSTRAINT "PK_01cc19189077b93d6e832cd2d14" PRIMARY KEY ("id"))`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "event_sponsors" ADD CONSTRAINT "FK_4cb75f6aae3ff8fe35cd3417383" FOREIGN KEY ("sponsor_id") REFERENCES "sponsors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "event_sponsors" ADD CONSTRAINT "FK_8fab88035a7a74536060237b404" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "event_sponsors" DROP CONSTRAINT "FK_8fab88035a7a74536060237b404"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "event_sponsors" DROP CONSTRAINT "FK_4cb75f6aae3ff8fe35cd3417383"`,
      undefined,
    );
    await queryRunner.query(`DROP TABLE "event_sponsors"`, undefined);
  }
}
