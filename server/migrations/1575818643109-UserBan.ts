import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserBan1575818643109 implements MigrationInterface {
  name = 'UserBan1575818643109';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "user_bans" (
          "id" SERIAL NOT NULL, 
          "user_id" integer, 
          "chapter_id" integer, 
          "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
          "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
          CONSTRAINT "PK_299b3ce7e72a9ac9aec5edeaf81" PRIMARY KEY ("id"))`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "user_bans" ADD CONSTRAINT "FK_a142c9954b2fd911b3e7ea8c307" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "user_bans" ADD CONSTRAINT "FK_bc062ec92b68995ff3ad5d00cdd" FOREIGN KEY ("chapter_id") REFERENCES "chapters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "user_bans" DROP CONSTRAINT "FK_bc062ec92b68995ff3ad5d00cdd"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "user_bans" DROP CONSTRAINT "FK_a142c9954b2fd911b3e7ea8c307"`,
      undefined,
    );
    await queryRunner.query(`DROP TABLE "user_bans"`, undefined);
  }
}
