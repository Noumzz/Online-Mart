import { MigrationInterface, QueryRunner } from "typeorm";

export class FixedAB1767965243692 implements MigrationInterface {
    name = 'FixedAB1767965243692'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "middleName" character varying NOT NULL DEFAULT 'no'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "middleName"`);
    }

}
