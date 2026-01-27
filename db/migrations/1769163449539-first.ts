import { MigrationInterface, QueryRunner } from "typeorm";

export class First1769163449539 implements MigrationInterface {
    name = 'First1769163449539'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "rider" ("id" SERIAL NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "contactNumber" character varying NOT NULL, "bikeType" character varying NOT NULL, "bikeRegistrationNumber" character varying NOT NULL, "linsence" character varying NOT NULL, "refreshToken" text, CONSTRAINT "UQ_bcd77a964c7fce52c5910bf2621" UNIQUE ("email"), CONSTRAINT "PK_1ed6540e613592e2a470a162ef1" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "rider"`);
    }

}
