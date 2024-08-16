import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationName1723841252369 implements MigrationInterface {
    name = 'MigrationName1723841252369'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" ADD "tempo" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "tempo"`);
    }

}
