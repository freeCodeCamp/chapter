import { MigrationInterface, QueryRunner } from 'typeorm';

export class Sponsor1575816404398 implements MigrationInterface {
  name = 'Sponsor1575816404398';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "sponsors" (
          "id" SERIAL NOT NULL, 
          "name" character varying NOT NULL, 
          "website" character varying NOT NULL, 
          "logo_path" character varying NOT NULL, 
          "type" character varying NOT NULL, 
          "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
          "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
          CONSTRAINT "PK_6d1114fe7e65855154351b66bfc" PRIMARY KEY ("id"))`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP TABLE "sponsors"`, undefined);
  }
}
