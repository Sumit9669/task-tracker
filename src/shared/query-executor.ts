import logger from "./logger";
import { Database } from "src/database/database";
import app from "src/server";
import TaskTrackerException from "src/custom-exceptions/tracker.exception";
import { GeneralHttpExceptions } from "src/custom-exceptions/general-exceptions.constants";

/**
 * this method will retyurn a promise for executing the queries
 * @param qry pass the qry and get the desired results
 */
export const ExecuteQuery = async (
  qry: string,
  data?: any,
  con?: any
): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    // const db: Database = Database.getDBInstance();
    let poolConn = app.get("DB");
    let connection = con || poolConn;
    if (data) {
      connection.query(qry, [data], async (err: Error, result: any) => {
        if (err) {
          logger.error("Qry--> " + qry);
          logger.error("error " + err);
          reject(
            new TaskTrackerException(
              GeneralHttpExceptions.DatabaseException,
              GenerateSqlError(err),
              new Error().stack
            )
          );
        } else {
          resolve(result);
        }
      });
    } else {
      if (!connection) {
        await Database.getDBInstance();
        poolConn = app.get("DB");
        connection = con || poolConn;
      }
      if (connection) {
        connection.query(qry, async (err: Error, result: any) => {
          if (err) {
            logger.error("error " + err);
            reject(
              new TaskTrackerException(
                GeneralHttpExceptions.DatabaseException,
                GenerateSqlError(err),
                new Error().stack
              )
            );
          } else {
            resolve(result);
          }
        });
      } else {
        reject("Database not intialized yet");
      }
    }
  });
};

// function for running query
export const RunQueryWithDedicatedConnection = async (
  qry: string,
  con: any,
  data?: any
): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (data) {
      // tslint:disable-next-line: only-arrow-functions
      con.query(qry, [data], async function (err: any, res: any) {
        if (err) {
          reject(err);
          return;
        } else {
          resolve(res);
          return;
        }
      });
    } else {
      // tslint:disable-next-line: only-arrow-functions
      con.query(qry, async function (err: any, res: any) {
        if (err) {
          reject(err);
          return;
        } else {
          resolve(res);
          return;
        }
      });
    }
  });
};

/**
 *  will get the exact message and Query for SQL
 * @param err pass the err
 * @returns
 */
function GenerateSqlError(err: any): string {
  return (
    ` Error Message:- ${err.message}\n` +
    ` SQL Error Message:- ${err.sqlMessage} \n` +
    ` Sql Query:- ${err.sql}`
  );
}
