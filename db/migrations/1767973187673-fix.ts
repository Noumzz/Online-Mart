import { MigrationInterface, QueryRunner } from "typeorm";

export class Fix1767973187673 implements MigrationInterface {
    name = 'Fix1767973187673'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "OrderItem" ADD "productId" integer`);
        await queryRunner.query(`ALTER TABLE "OrderItem" ADD CONSTRAINT "FK_5b590ac1105dfd63b399cdc79bb" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "OrderItem" DROP CONSTRAINT "FK_5b590ac1105dfd63b399cdc79bb"`);
        await queryRunner.query(`ALTER TABLE "OrderItem" DROP COLUMN "productId"`);
    }

}
