import { MigrationInterface, QueryRunner } from 'typeorm';

export class Tag1575818467092 implements MigrationInterface {
  name = 'Tag1575818467092';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "tags" (
        "id" SERIAL NOT NULL, 
        "name" character varying NOT NULL, 
        "event_id" integer, 
        "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
        CONSTRAINT "PK_e7dc17249a1148a1970748eda99" PRIMARY KEY ("id"))`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "tags" ADD CONSTRAINT "FK_fd793b86b010970181e155eb750" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "tags" DROP CONSTRAINT "FK_fd793b86b010970181e155eb750"`,
      undefined,
    );
    await queryRunner.query(`DROP TABLE "tags"`, undefined);
  }
}
