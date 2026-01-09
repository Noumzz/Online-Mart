import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedProducts1767795476795 implements MigrationInterface {
    name = 'AddedProducts1767795476795'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "product" ("id" SERIAL NOT NULL, "productName" character varying NOT NULL, "category" text array NOT NULL, "price" integer NOT NULL, "quantity" integer NOT NULL DEFAULT '0', "discount" numeric(5,2) NOT NULL DEFAULT '0', CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "product"`);
    }

}
