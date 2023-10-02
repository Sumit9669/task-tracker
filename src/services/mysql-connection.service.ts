import { OperationType } from "./../enums/operation-types";
import { BusinessEntities } from "src/enums/common-enums";
import { MessageConstants } from "@constants/response.constants";
import { GeneralHttpExceptions } from "src/custom-exceptions/general-exceptions.constants";
import TaskTrackerException from "src/custom-exceptions/tracker.exception";
import logger from "@shared/logger";
import { createConnection } from "typeorm";
import * as mysql from "mysql";
import app from "@server";
import fs from "fs";
import moment from "moment";
export class MysqlConnectionService {
  /**
   * Create the Database and the Table Structure
   * @param request params of queue data
   */
  async createConnection() {
    try {
      // get server connection
      const conn = app.get("MYSQL_DB");
      const dbName = process.env.DB_NAME ?? "";

      // creating the database with the name as business Id
      const dbConnection = await this.createDatabase(dbName, conn);
      console.log(dbConnection);
      if (!dbConnection) {
        logger.info("Error in Creating Database");
        throw new TaskTrackerException(
          GeneralHttpExceptions.DatabaseException,
          MessageConstants.general.databaseError,
          new Error().stack
        );
      }
      // Creating the table Structure of Mysql
      await this.createTableStructure(dbName);
      logger.info(`MIGRATION COMPLETED ${dbName} `);
      return true;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * this will create the Database with the name businessId
   * @param businessId pass the businessId
   * @param conn pass the active connection
   */
  public createDatabase(
    businessId: string,
    conn: any
  ): Promise<mysql.PoolConnection> {
    console.log(conn, businessId);
    return new Promise(async (resolve, reject) => {
      conn.query(
        "CREATE DATABASE `" + businessId + "`",
        (err: any, connection: any) => {
          if (err) {
            logger.error(`ERROR in creating Database ${businessId}`);
            return reject(err);
          }
          logger.info(`DATABASE CREATED ${businessId} `);

          return resolve(connection);
        }
      );
    });
  }

  /**
   * this will create the structure of Database
   * @param businessId pass the businessId
   */
  async createTableStructure(businessId: string) {
    let connection: any;
    try {
      connection = await createConnection({
        type: "mysql",
        host: process.env.DB_HOST,
        password: process.env.DB_PASS,
        database: businessId,
        username: process.env.DB_USER,
        migrations: ["src/migration/**/*.ts"],
        name: "c1",
      });
      await connection.runMigrations({ transaction: "all" });
      await connection.close();
      return true;
    } catch (error: any) {
      logger.info(`Error in creating Table from Migration ${error}`);
      if (connection) {
        await connection.close();
      }
      return false;
    }
  }

  /**
   *
   * @returns true after succefully running migration
   */
  async runMigration() {
    try {
      // get server connection
      const conn = app.get("MYSQL_DB");

      // get all the databases from connection
      const allDatabases: any = await this.getAllDatabase(conn);

      if (!allDatabases) {
        logger.info("Error in getting Databases");
        throw new TaskTrackerException(
          GeneralHttpExceptions.DatabaseException,
          MessageConstants.general.getDatabaseError,
          new Error().stack
        );
      }

      const todayDateString = moment().format("YYYY-MM-DD");
      console.log("All database length", allDatabases.length);
      for (const database of allDatabases) {
        // updating the table Structure of each database
        console.log("Database Started:-", database);
        const res = await this.createTableStructure(database.databaseName);
        if (res) {
          // create file -> and insert updated for this businesss and ID
          logger.info(`MIGRATION UPDATED FOR ${database.databaseName} `);
          try {
            fs.appendFileSync(
              "./logs/MigrationUpdatedSuccess-" + todayDateString + ".txt",
              `MIGRATION UPDATED FOR ${database.databaseName} \n`
            );
          } catch (error: any) {
            console.log("Failed Writting File");
          }
        } else {
          // fail in other file...
          logger.info(`MIGRATION FAILED FOR ${database.databaseName} `);
          try {
            fs.appendFileSync(
              "./logs/MigrationUpdatedFailed-" + todayDateString + ".txt",
              `MIGRATION FAILED FOR ${database.databaseName} \n`
            );
          } catch (error: any) {
            console.log("Failed Writting File");
          }
        }
        console.log("Database Done:-", database);
      }
      return true;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * this will get all the Database of businesses
   * @param conn pass the active connection
   */
  public getAllDatabase(conn: any): Promise<mysql.PoolConnection> {
    return new Promise(async (resolve, reject) => {
      conn.query(
        `
            SELECT DISTINCT schema_name AS 'databaseName'
FROM   information_schema.schemata
WHERE  schema_name NOT IN ( 'information_schema', 'sys', 'mysql',
                            'performance_schema',
                            'smai_service', 'smai_service_dev' )
       AND ( schema_name LIKE 'b_%'
              OR schema_name = 'migration_default' )`,
        (err: any, res: any) => {
          if (err) {
            logger.error(`ERROR in getting all databases`);
            return reject(err);
          }
          console.log(`All DATABASE Fetched`, JSON.stringify(res));
          return resolve(res);
        }
      );
    });
  }
}
