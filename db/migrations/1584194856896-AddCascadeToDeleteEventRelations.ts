import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCascadeToDeleteEventRelations1584194856896 implements MigrationInterface {
  name = 'AddCascadeToDeleteEventRelations1584194856896';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "rsvps" DROP CONSTRAINT "FK_04d52fc9fe91004aa1860603ea3"`, undefined);
    await queryRunner.query(`ALTER TABLE "event_sponsors" DROP CONSTRAINT "FK_4cb75f6aae3ff8fe35cd3417383"`, undefined);
    await queryRunner.query(`ALTER TABLE "event_sponsors" DROP CONSTRAINT "FK_8fab88035a7a74536060237b404"`, undefined);

    await queryRunner.query(`ALTER TABLE "event_sponsors" ADD CONSTRAINT "FK_4cb75f6aae3ff8fe35cd3417383" FOREIGN KEY ("sponsor_id") REFERENCES "sponsors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    await queryRunner.query(`ALTER TABLE "event_sponsors" ADD CONSTRAINT "FK_8fab88035a7a74536060237b404" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    await queryRunner.query(`ALTER TABLE "rsvps" ADD CONSTRAINT "FK_04d52fc9fe91004aa1860603ea3" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "event_sponsors" ADD CONSTRAINT "FK_8fab88035a7a74536060237b404" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    await queryRunner.query(`ALTER TABLE "event_sponsors" ADD CONSTRAINT "FK_4cb75f6aae3ff8fe35cd3417383" FOREIGN KEY ("sponsor_id") REFERENCES "sponsors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    await queryRunner.query(`ALTER TABLE "rsvps" ADD CONSTRAINT "FK_04d52fc9fe91004aa1860603ea3" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);

    await queryRunner.query(`ALTER TABLE "rsvps" DROP CONSTRAINT "FK_04d52fc9fe91004aa1860603ea3"`, undefined);
    await queryRunner.query(`ALTER TABLE "event_sponsors" DROP CONSTRAINT "FK_8fab88035a7a74536060237b404"`, undefined);
    await queryRunner.query(`ALTER TABLE "event_sponsors" DROP CONSTRAINT "FK_4cb75f6aae3ff8fe35cd3417383"`, undefined);
  }
}
