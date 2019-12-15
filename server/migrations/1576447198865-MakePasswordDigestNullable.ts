import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakePasswordDigestNullable1576447198865
  implements MigrationInterface {
  name = 'MakePasswordDigestNullable1576447198865';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "password_digest" DROP NOT NULL`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "password_digest" SET NOT NULL`,
      undefined,
    );
  }
}
