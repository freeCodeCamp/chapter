import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsInviteOnlyToEvents1624722820564 implements MigrationInterface {
  name = 'AddIsInviteOnlyToEvents1624722820564';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "events" ADD "invite_only" boolean NOT NULL DEFAULT false`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "invite_only"`);
  }
}
