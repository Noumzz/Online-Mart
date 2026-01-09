import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedTheRelations1767952917138 implements MigrationInterface {
    name = 'AddedTheRelations1767952917138'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "StoreOwner" ("id" SERIAL NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "contactNumber" character varying NOT NULL, "shops" text array, "products" text array, CONSTRAINT "PK_c482d708668cdc931e113a0a09a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "OrderItem" ("id" SERIAL NOT NULL, "productId" integer NOT NULL, "quantity" integer NOT NULL, "totalAmount" integer NOT NULL, "cartId" integer, CONSTRAINT "PK_6bdc02af31674c4216a6b0a8b39" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Cart" ("id" SERIAL NOT NULL, "userId" integer, CONSTRAINT "REL_c93d6f0ae7b8bcae9439e871ab" UNIQUE ("userId"), CONSTRAINT "PK_012c8ac0dc98012aed2f7766e01" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Order" ("id" SERIAL NOT NULL, "customerId" integer NOT NULL, "totalAmount" integer NOT NULL, CONSTRAINT "PK_3d5a3861d8f9a6db372b2b317b7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "store_owners_store_owner" ("storeId" integer NOT NULL, "storeOwnerId" integer NOT NULL, CONSTRAINT "PK_d67b867d4814e538fc20e8e523a" PRIMARY KEY ("storeId", "storeOwnerId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_927dc8173d27690380e001611f" ON "store_owners_store_owner" ("storeId") `);
        await queryRunner.query(`CREATE INDEX "IDX_f230da6d92a08095e8f8de1da5" ON "store_owners_store_owner" ("storeOwnerId") `);
        await queryRunner.query(`ALTER TABLE "store" DROP COLUMN "owners"`);
        await queryRunner.query(`ALTER TABLE "store" DROP COLUMN "products"`);
        await queryRunner.query(`ALTER TABLE "product" ADD "storeId" integer`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_32eaa54ad96b26459158464379a" FOREIGN KEY ("storeId") REFERENCES "store"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "OrderItem" ADD CONSTRAINT "FK_c81ecdf018910af1574a45a11af" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Cart" ADD CONSTRAINT "FK_c93d6f0ae7b8bcae9439e871ab1" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "store_owners_store_owner" ADD CONSTRAINT "FK_927dc8173d27690380e001611fb" FOREIGN KEY ("storeId") REFERENCES "store"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "store_owners_store_owner" ADD CONSTRAINT "FK_f230da6d92a08095e8f8de1da58" FOREIGN KEY ("storeOwnerId") REFERENCES "StoreOwner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store_owners_store_owner" DROP CONSTRAINT "FK_f230da6d92a08095e8f8de1da58"`);
        await queryRunner.query(`ALTER TABLE "store_owners_store_owner" DROP CONSTRAINT "FK_927dc8173d27690380e001611fb"`);
        await queryRunner.query(`ALTER TABLE "Cart" DROP CONSTRAINT "FK_c93d6f0ae7b8bcae9439e871ab1"`);
        await queryRunner.query(`ALTER TABLE "OrderItem" DROP CONSTRAINT "FK_c81ecdf018910af1574a45a11af"`);
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_32eaa54ad96b26459158464379a"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "storeId"`);
        await queryRunner.query(`ALTER TABLE "store" ADD "products" integer array NOT NULL`);
        await queryRunner.query(`ALTER TABLE "store" ADD "owners" integer array NOT NULL`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f230da6d92a08095e8f8de1da5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_927dc8173d27690380e001611f"`);
        await queryRunner.query(`DROP TABLE "store_owners_store_owner"`);
        await queryRunner.query(`DROP TABLE "Order"`);
        await queryRunner.query(`DROP TABLE "Cart"`);
        await queryRunner.query(`DROP TABLE "OrderItem"`);
        await queryRunner.query(`DROP TABLE "StoreOwner"`);
    }

}
