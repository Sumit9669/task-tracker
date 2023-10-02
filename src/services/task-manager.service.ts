import { CommonFunctions } from "@shared/common-functions";
import { ExecuteQuery } from "@shared/query-executor";
import { GeneralHttpExceptions } from "src/custom-exceptions";
import TaskTrackerException from "src/custom-exceptions/tracker.exception";
import { TrackerQueries } from "src/queries/tracker.query";
import { TaskStatus } from "@constants/common.constants";
import _ from "lodash";
import moment from "moment";
import MessageConstants from "@constants/response.constants";
const commonFunctions = new CommonFunctions();
export class TaskManagerService {
  /**
   * @description
   * To create a task
   * @param requestBody, pass requestbody
   */
  async createTask(requestBody: any) {
    // let createQuery = TrackerQueries.saveTaskDetail();
    const parsedData = this.parseRequestDataforNewTask(requestBody);
    let createQuery = TrackerQueries.saveTaskDetail(parsedData);
    const result = await ExecuteQuery(createQuery);
    return result;
  }

  /**
   * @description
   * To get a task list detail or detail by id
   * @param filterDetail , pass filterDetail
   * @param id, pass id
   */
  async getTaskList(filterDetail?: any, id?: string) {
    let createListQuery = TrackerQueries.getTaskDetailQuewry(filterDetail,id);
    const result = await ExecuteQuery(createListQuery);
    return result;
  }

  /**
   * @description
   * To update task detail
   * @param requstBody , pass requestBody
   */
  async updateTask(requestBody: any) {
    /** Check if id exist */
    const query = TrackerQueries.getTaskDetailQuewry(requestBody.id);
    const taskDetail = await ExecuteQuery(query);
    if (taskDetail) {
      let createQuery = TrackerQueries.updateTaskById(requestBody);
      const parsedData = this.parseDataForUpdate(requestBody);
      createQuery.replace("?", parsedData);
      const result = await ExecuteQuery(createQuery);
      return result;
    } else {
      throw new TaskTrackerException(
        GeneralHttpExceptions.NotFoundException,
        MessageConstants.general.invalidUserId
      );
    }
  }

  /**
   * @description
   * To delete task by id
   * @param id , pass id
   */
  async deleteTaskById(id: string) {
    const query = TrackerQueries.deleteTaskByid(id);
    await ExecuteQuery(query);
    return true;
  }

  /**
   * @description
   * To get matric of all the tasks based on
   * filter passed by user
   * @param filterDetail , pass filterDetail
   */
  async getTaskMatric(sortBy?: boolean, date?: string) {
    const matricsQuery = TrackerQueries.getTaskMatric(sortBy, date);
    let matricsDetail = await ExecuteQuery(matricsQuery);
    matricsDetail = this.parseMatricsDetail(matricsDetail, sortBy);
    return matricsDetail;
  }

  /**
   * @description
   * Separate columna and values
   * @param requestBody . pass requestBody
   * @returns column and values to save in db
   */
  parseRequestDataforNewTask(requestBody: any) {
    let columns = "id";
    let values = `"${commonFunctions.uuid4()}"`;
    for (let item in requestBody) {
      columns += "," + item;
      values += "," + `"${requestBody[item]}"`;
    }
    return { columns, values };
  }

  /**
   * @description
   * format data for updating values for particular id
   */
  parseDataForUpdate(requestBody: any) {
    let formatedData = "";
    for (let item in requestBody) {
      formatedData += `${item}=${requestBody[item]}` + ",";
    }
    return formatedData;
  }

  /**
   * @description
   * To parse rawData
   * @param data , pass data
   * @param sortByDate, pass sortByDate
   * @returns parsedMatric respose
   */
  parseMatricsDetail(data: any, sortByDate?: boolean) {
    let result: any;
    if (sortByDate) {
      const sortedRecords: any = _.groupBy(data, "datedAs");
      const resultList = [];
      for (let item in sortedRecords) {
        const matrics = {
          open: 0,
          completed: 0,
          inprogress: 0,
        };
        const record = sortedRecords[`${item}`];
        for (let rawData of record) {
          if (rawData.status === TaskStatus.open) {
            matrics["open"] = matrics["open"] + rawData.totalCount;
          } else if (rawData.status === TaskStatus.active) {
            matrics["inprogress"] = matrics["open"] + rawData.totalCount;
          } else {
            matrics["completed"] = matrics["open"] + rawData.totalCount;
          }
        }
        resultList.push({
          date: moment(item).format("MMMM DD"),
          matrics,
        });
      }
      return resultList;
    } else {
      for (let item of data) {
        if (item.status === TaskStatus.open) {
          result["open"] = item.totalCount;
        } else if (item.status === TaskStatus.active) {
          result["inprogress"] = item.totalCount;
        } else {
          result["completed"] = item.totalCount;
        }
      }
    }

    return result;
  }
}
