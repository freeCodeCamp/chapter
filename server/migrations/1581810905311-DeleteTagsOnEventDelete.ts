import { MigrationInterface, QueryRunner } from 'typeorm';

export class DeleteTagsOnEventDelete1581810905311 implements MigrationInterface {
  name = 'DeleteTagsOnEventDelete1581810905311';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "tags" DROP CONSTRAINT "FK_fd793b86b010970181e155eb750"`, undefined);
    await queryRunner.query(`ALTER TABLE "tags" ADD CONSTRAINT "FK_fd793b86b010970181e155eb750" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "tags" DROP CONSTRAINT "FK_fd793b86b010970181e155eb750"`, undefined);
    await queryRunner.query(`ALTER TABLE "tags" ADD CONSTRAINT "FK_fd793b86b010970181e155eb750" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
  }
}
