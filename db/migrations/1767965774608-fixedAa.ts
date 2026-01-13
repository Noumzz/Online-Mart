import { MigrationInterface, QueryRunner } from "typeorm";

export class FixedAa1767965774608 implements MigrationInterface {
    name = 'FixedAa1767965774608'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "middleName"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "middleName" character varying NOT NULL DEFAULT 'no'`);
    }

}
