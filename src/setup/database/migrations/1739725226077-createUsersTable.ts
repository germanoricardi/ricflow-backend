import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1739725226077 implements MigrationInterface {
  name = 'CreateUsersTable1739725226077';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "subjectId" character varying, "userName" character varying(100) NOT NULL, "email" character varying(255) NOT NULL, "passwordHash" character varying(255), "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_951b8f1dfc94ac1d0301a14b7e1" UNIQUE ("uuid"), CONSTRAINT "UQ_94aa4ae34252ef10124f0ef71f9" UNIQUE ("subjectId"), CONSTRAINT "UQ_226bb9aa7aa8a69991209d58f59" UNIQUE ("userName"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
