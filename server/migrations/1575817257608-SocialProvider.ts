import { MigrationInterface, QueryRunner } from 'typeorm';

export class SocialProvider1575817257608 implements MigrationInterface {
  name = 'SocialProvider1575817257608';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "social_providers" (
          "id" SERIAL NOT NULL, 
          "name" character varying NOT NULL, 
          "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
          "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
          CONSTRAINT "PK_b436096f9efa0ae93c6dc8d1aec" PRIMARY KEY ("id"))`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP TABLE "social_providers"`, undefined);
  }
}
