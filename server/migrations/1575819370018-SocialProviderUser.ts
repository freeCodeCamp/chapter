import { MigrationInterface, QueryRunner } from 'typeorm';

export class SocialProviderUser1575819370018 implements MigrationInterface {
  name = 'SocialProviderUser1575819370018';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "social_provider_users" (
          "id" SERIAL NOT NULL, 
          "provider_id" integer,
          "provider_user_id" character varying NOT NULL, 
          "user_id" integer, 
          "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
          "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
          CONSTRAINT "PK_6889db5e9ddde1b25ed0090b407" PRIMARY KEY ("id"))`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "social_provider_users" ADD CONSTRAINT "FK_917ed23863f4248c814f6c7f36a" FOREIGN KEY ("provider_id") REFERENCES "social_providers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "social_provider_users" ADD CONSTRAINT "FK_88dbf6a43ed7af106b6d63f0c74" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "social_provider_users" DROP CONSTRAINT "FK_88dbf6a43ed7af106b6d63f0c74"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "social_provider_users" DROP CONSTRAINT "FK_917ed23863f4248c814f6c7f36a"`,
      undefined,
    );
    await queryRunner.query(`DROP TABLE "social_provider_users"`, undefined);
  }
}
