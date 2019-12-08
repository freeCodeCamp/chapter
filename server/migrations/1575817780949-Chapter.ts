import { MigrationInterface, QueryRunner } from 'typeorm';

export class Chapter1575817780949 implements MigrationInterface {
  name = 'Chapter1575817780949';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "chapters" (
          "id" SERIAL NOT NULL, 
          "name" character varying NOT NULL, 
          "description" character varying NOT NULL, 
          "category" character varying NOT NULL, 
          "details" json NOT NULL, 
          "location_id" integer, 
          "creator_id" integer, 
          "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
          "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
          CONSTRAINT "PK_a2bbdbb4bdc786fe0cb0fcfc4a0" PRIMARY KEY ("id"))`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "chapters" ADD CONSTRAINT "FK_95d978cb93804fa26283d6741cf" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "chapters" ADD CONSTRAINT "FK_60315cd6f39d467818aa7c60505" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "chapters" DROP CONSTRAINT "FK_60315cd6f39d467818aa7c60505"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "chapters" DROP CONSTRAINT "FK_95d978cb93804fa26283d6741cf"`,
      undefined,
    );
    await queryRunner.query(`DROP TABLE "chapters"`, undefined);
  }
}
