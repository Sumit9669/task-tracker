import * as mysql from "mysql2";
import app from "@server";
import logger from "@shared/logger";

/**
 * Database class for connecting application to DB
 */
class Database {
  private static instance: any = null;
  private mysqlnativepool: mysql.Pool;

  constructor() {
    /** create Pool */
    const pool = mysql.createPool({
      connectionLimit: 30,
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      charset: "utf8mb4",
      dateStrings: ["DATE"],
      decimalNumbers: true,
    });

    logger.info("Connected successfully to MYSQL DB server");
    this.mysqlnativepool = pool;
    /** SET ACTIVE CONNECTION POOL DETAIL**/
    app.set("MYSQL_DB", pool);
  }

  /**
   * Get DB Instance
   */
  public static async getDBInstance() {
    if (!Database.instance) {
      try {
        Database.instance = new Database();
      } catch (error: any) {
        console.log("DB Connection ERROR! " + error);
        process.exit(1);
      }
    }

    return Database.instance;
  }
}
export { Database };
