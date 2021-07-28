import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserEventRole1627405075557 implements MigrationInterface {
  name = 'UserEventRole1627405075557';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "user_event_roles" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer NOT NULL, "event_id" integer NOT NULL, "role_name" text NOT NULL, CONSTRAINT "PK_dbacaad72c217a739f93cabb7a9" PRIMARY KEY ("id", "user_id", "event_id", "role_name"))`);
    await queryRunner.query(`ALTER TABLE "user_event_roles" ADD CONSTRAINT "FK_bb21cc4b5de8cf9e8476d75b7a7" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "user_event_roles" ADD CONSTRAINT "FK_f098ebd3c390d8e0f1e6ce882c6" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_event_roles" DROP CONSTRAINT "FK_f098ebd3c390d8e0f1e6ce882c6"`);
    await queryRunner.query(`ALTER TABLE "user_event_roles" DROP CONSTRAINT "FK_bb21cc4b5de8cf9e8476d75b7a7"`);
    await queryRunner.query(`DROP TABLE "user_event_roles"`);
  }
}
