import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatedStore1767799149613 implements MigrationInterface {
    name = 'UpdatedStore1767799149613'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store" DROP COLUMN "contactNumber"`);
        await queryRunner.query(`ALTER TABLE "store" ADD "contactNumber" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store" DROP COLUMN "contactNumber"`);
        await queryRunner.query(`ALTER TABLE "store" ADD "contactNumber" integer NOT NULL`);
    }

}
