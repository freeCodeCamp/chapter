import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserChapter1575817782077 implements MigrationInterface {
  name = 'UserChapter1575817782077';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "user_chapters" (
          "id" SERIAL NOT NULL, 
          "user_id" integer, 
          "chapter_id" integer, 
          "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
          "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
          CONSTRAINT "PK_451c90e328a46e8d75f01029c7d" PRIMARY KEY ("id"))`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "user_chapters" ADD CONSTRAINT "FK_48f715cb79511ccbf947b70d42c" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "user_chapters" ADD CONSTRAINT "FK_a88e0c594dfd6492084b9b3f13b" FOREIGN KEY ("chapter_id") REFERENCES "chapters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "user_chapters" DROP CONSTRAINT "FK_a88e0c594dfd6492084b9b3f13b"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "user_chapters" DROP CONSTRAINT "FK_48f715cb79511ccbf947b70d42c"`,
      undefined,
    );
    await queryRunner.query(`DROP TABLE "user_chapters"`, undefined);
  }
}
