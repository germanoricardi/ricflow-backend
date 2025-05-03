import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPasswordResetTokenAndPasswordResetExpiresColumnsInUsersTable1746249379041
  implements MigrationInterface
{
  name =
    'AddPasswordResetTokenAndPasswordResetExpiresColumnsInUsersTable1746249379041';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "passwordResetToken" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "passwordResetExpires" TIMESTAMP`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "passwordResetExpires"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "passwordResetToken"`,
    );
  }
}
