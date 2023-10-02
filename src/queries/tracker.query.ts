const db = process.env.DB_NAME;
export class TrackerQueries {
  /*
   * will return the save business credit debit query
   */
  public static saveTaskDetail = (payload: any) => {
    return `INSERT INTO ${db}.user_task (${payload.columns}) VALUES (${payload.values})`;
  };

  /**
   *
   * get task detail by id
   */
  public static getTaskDetailQuewry = (filter?: any, id?: string) => {
    let qry = `select * from ${db}.user_task`;
    if (id) {
      qry += ` where id ="${id}"`;
    }
    if (filter.pageNumber && filter.pageSize) {
      qry += ` limit ${filter.pageNumber} , ${filter.pageSize}`;
    }
    return qry;
  };

  /**
   *
   * delete the business Journals
   */
  public static deleteTaskByid = (id: string) => {
    return `delete from ${db}.user_task where id ="${id}"`;
  };

  /**
   *
   * delete the business Journals
   */
  public static getTaskMatric = (sortedByDate?: boolean, date?: string) => {
    let qry = "";
    if (sortedByDate) {
      qry = `select status,  date(updatedAt) as datedAs, count(*) as totalCount from ${db}.user_task`;
      if (date) {
        qry += ` where updatedAt = "${date}"`;
      }
      qry += `  GROUP BY status, updatedAt;`;
    } else {
      qry = `select status, count(*) as totalCount from ${db}.user_task GROUP BY status;`;
    }
    return qry;
  };

  public static updateTaskById = (requestBody: any) => {
    return `UPDATE table_name
    set
    ?
    WHERE  id =${requestBody.id}`;
  };
}
