import { MigrationInterface, QueryRunner } from 'typeorm';

export class Chapter1574341690449 implements MigrationInterface {
  name = 'Chapter1574341690449';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "chapters" (
        "id" SERIAL NOT NULL,
        "name" character varying NOT NULL,
        "description" character varying NOT NULL,
        "category" character varying NOT NULL,
        "details" json NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_a2bbdbb4bdc786fe0cb0fcfc4a0" PRIMARY KEY ("id"))`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP TABLE "chapters"`, undefined);
  }
}
