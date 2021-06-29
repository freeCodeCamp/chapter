import { MigrationInterface, QueryRunner } from 'typeorm';

export class EventsUsers1624978481930 implements MigrationInterface {
  name = 'EventsUsers1624978481930';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "events_users" ("user_id" integer NOT NULL, "event_id" integer NOT NULL, CONSTRAINT "PK_f3bea340f13558177a594fff0af" PRIMARY KEY ("user_id", "event_id"))`);
    await queryRunner.query(`CREATE INDEX "IDX_df93e44b48c1545c0795a11543" ON "events_users" ("user_id") `);
    await queryRunner.query(`CREATE INDEX "IDX_6bce6dc80ee8e9f5a960e96eb3" ON "events_users" ("event_id") `);
    await queryRunner.query(`ALTER TABLE "events_users" ADD CONSTRAINT "FK_df93e44b48c1545c0795a115435" FOREIGN KEY ("user_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "events_users" ADD CONSTRAINT "FK_6bce6dc80ee8e9f5a960e96eb35" FOREIGN KEY ("event_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "events_users" DROP CONSTRAINT "FK_6bce6dc80ee8e9f5a960e96eb35"`);
    await queryRunner.query(`ALTER TABLE "events_users" DROP CONSTRAINT "FK_df93e44b48c1545c0795a115435"`);
    await queryRunner.query(`DROP INDEX "IDX_6bce6dc80ee8e9f5a960e96eb3"`);
    await queryRunner.query(`DROP INDEX "IDX_df93e44b48c1545c0795a11543"`);
    await queryRunner.query(`DROP TABLE "events_users"`);
  }
}
