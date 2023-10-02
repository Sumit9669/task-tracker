import { MessageConstants } from "@constants/response.constants";
import { GeneralHttpExceptions } from "src/custom-exceptions/general-exceptions.constants";
import TaskTrackerException from "src/custom-exceptions/tracker.exception";
import logger from "@shared/logger";
export class TaskManagerService {
  
    /**
     * @description
     * To create a task
     * @param requestBody, pass requestbody 
     */
    createTask(requestBody:any){


    }

    /**
     * @description
     * To get a task list detail or detail by id
     * @param filterDetail , pass filterDetail
     * @param id, pass id 
     */
    getTaskList(filterDetail?:any,id?:string){

    }

    /**
     * @description
     * To update task detail
     * @param requstBody , pass requestBody
     */
    updateTask(requstBody:any){

    }

    /**
     * @description
     * To delete task by id
     * @param id , pass id
     */
    deleteTaskById(id:string){

    }

    /**
     * @description
     * To get matric of all the tasks based on
     * filter passed by user
     * @param filterDetail , pass filterDetail
     */
    getTaskMatric(filterDetail?:string){

    }
}
