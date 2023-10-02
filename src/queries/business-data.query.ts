import { CommonFunctions } from "@shared/common-functions";

const commonFunctions = new CommonFunctions();
const db = process.env.DB_NAME;
export class BusinessDataQueries {
  /*
   * will return the save business credit debit query
   */
  public static saveTaskDetail = () => {
    return `INSERT INTO ${db}.user_tasks (taskcolumns) VALUES ?`;
  };

  /**
   *
   * get task detail by id
   */
  public static getTaskDetailQuewry = (id?: string) => {
    let qry = `select * from ${db}.user_tasks`;
    if (id) {
      qry += ` where id =${id}`;
    }
    return qry;
  };

  /**
   *
   * delete the business Journals
   */
  public static deleteTaskByid = (id: string) => {
    return `delete from ${db}.user_tasks where id =${id}`;
  };

  /**
   *
   * delete the business Journals
   */
  public static getTaskMatric = (id: string) => {
    return `delete from ${db}.user_tasks where id =${id}`;
  };

  public static updateTaskById = (requestBody: any) => {
    return `UPDATE table_name
    ?
    WHERE  id =${requestBody.id}`;
  };
}
