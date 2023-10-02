// Module imports
import { Router, Request, Response } from "express";
import { NextFunction } from "express";
import { createValidator } from "express-joi-validation";

// Files imports
import { MessageConstants } from "@constants/response.constants";
import { GeneralHttpExceptions } from "src/custom-exceptions/general-exceptions.constants";
import TaskTrackerException from "src/custom-exceptions/tracker.exception";

const validator = createValidator({ passError: true });
const basePath = "/tracker";
class TrackerRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.mountRoutes();
  }

  private mountRoutes() {
    this.router.post(`${basePath}`, this.addTask);
    this.router.get(`${basePath}`, this.getTaskList);
    this.router.patch(`${basePath}`, this.updateTask);
    this.router.get(`${basePath}`, this.getTaskMaatric);
    this.router.get(`${basePath}/:id`, this.getTaskDetailById);
    this.router.delete(`${basePath}/:id`, this.deleteTaskById);
  }
  deleteTaskById(arg0: string, deleteTaskById: any) {
    throw new Error("Method not implemented.");
  }
  getTaskDetailById(arg0: string, getTaskDetailById: any) {
    throw new Error("Method not implemented.");
  }
  getTaskMaatric(arg0: string, getTaskMaatric: any) {
    throw new Error("Method not implemented.");
  }
  updateTask(arg0: string, updateTask: any) {
    throw new Error("Method not implemented.");
  }
  getTaskList(arg0: string, getTaskList: any) {
    throw new Error("Method not implemented.");
  }

  async addTask(req: Request, res: Response, next: NextFunction) {
    try {
      return res.json({
        status: true,
        message: MessageConstants.general.saved,
        metadata: {},
        data: {},
      });
    } catch (error: any) {
      // To check if error type is internal server error or not
      if (error instanceof TaskTrackerException) {
        throw error;
      } else {
        throw new TaskTrackerException(
          GeneralHttpExceptions.InternalServerException,
          error.message,
          error.stackTrace || error.stack,
          error
        );
      }
    }
  }
}
export = new TrackerRouter().router;
