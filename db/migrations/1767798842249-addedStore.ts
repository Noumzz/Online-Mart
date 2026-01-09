import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedStore1767798842249 implements MigrationInterface {
    name = 'AddedStore1767798842249'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "store" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "contactNumber" integer NOT NULL, "storeAddress" character varying NOT NULL, "owners" integer array NOT NULL, "products" integer array NOT NULL, CONSTRAINT "PK_f3172007d4de5ae8e7692759d79" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "store"`);
    }

}
