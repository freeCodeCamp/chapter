import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropProviderUserIdFromSovialProvierUsers1577221711324
  implements MigrationInterface {
  name = 'DropProviderUserIdFromSovialProvierUsers1577221711324';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "social_provider_users" DROP COLUMN "provider_user_id"`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "social_provider_users" ADD "provider_user_id" character varying NOT NULL`,
      undefined,
    );
  }
}
