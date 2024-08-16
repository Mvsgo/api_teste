import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationName1723768275396 implements MigrationInterface {
    name = 'MigrationName1723768275396'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "usernamex" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "usernamex"`);
    }

}
