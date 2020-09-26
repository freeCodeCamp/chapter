import { MigrationInterface, QueryRunner } from 'typeorm';

export class User1575817780103 implements MigrationInterface {
  name = 'User1575817780103';

  public async up(queryRunner: QueryRunner): Promise<any> {
    // Temporary chnages to schema just to prove google auth0 works
    await queryRunner.query(
      `CREATE TABLE "users" (
          "id" SERIAL NOT NULL,
          "first_name" character varying DEFAULT NULL,
          "last_name" character varying DEFAULT NULL,
          "email" character varying NOT NULL,
          "google_id" character varying DEFAULT NULL,
          "google_picture" character varying DEFAULT NULL,
          "password_digest" character varying,
          "created_at" TIMESTAMP NOT NULL DEFAULT now(),
          "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
          CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP TABLE "users"`, undefined);
  }
}
