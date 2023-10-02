import { MigrationInterface, QueryRunner } from "typeorm";

export class createTaskTable1696240546783 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `user_task` (`id` varchar(36) NOT NULL, `taskName` varchar(255) NOT NULL,`startDate` datetime(6),`endDate` datetime(6),`taskDetail` text, `status` int NOT NULL default 0,`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("DROP TABLE `user_task`");
  }
}
