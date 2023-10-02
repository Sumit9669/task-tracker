// Module imports
import { Router, Request, Response } from "express";
import { NextFunction } from "express";
import { createValidator } from "express-joi-validation";

// Files imports
import { MessageConstants } from "@constants/response.constants";
import { GeneralHttpExceptions } from "src/custom-exceptions/general-exceptions.constants";
import TaskTrackerException from "src/custom-exceptions/tracker.exception";
import { TaskManagerService } from "../../services/task-manager.service";
import moment from "moment";
const validator = createValidator({ passError: true });
const basePath = "/tracker";
const taskManagerSvc = new TaskManagerService();
class TrackerRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.mountRoutes();
  }

  private mountRoutes() {
    this.router.post(`${basePath}`, this.addTask);
    this.router.get(`${basePath}/list`, this.getTaskList);
    this.router.patch(`${basePath}/detail/:id`, this.updateTask);
    this.router.get(`${basePath}/matrics`, this.getTaskMaatric);
    this.router.get(`${basePath}/detail/:id`, this.getTaskDetailById);
    this.router.delete(`${basePath}/:id`, this.deleteTaskById);
    this.router.get(`${basePath}/matricsByDate`, this.getTaskMaatricByDate);
  }
  /**
   * @swagger
   * /tracker/detail/{id}:
   *  delete:
   *    summary: Remove task
   *    tags: [Task-Tracker]
   *    consumes:
   *      application/json
   *    produce:
   *      application/json
   *    description: To remove task by id
   *    parameters:
   *         - $ref: '#/components/parameters/id'
   *    responses:
   *      '200':
   *        description: Success
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                  status:
   *                    type: boolean
   *                    example: true
   *                  message:
   *                   type: string
   *                   example: 'task deleted successfully'
   */
  async deleteTaskById(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await taskManagerSvc.deleteTaskById(req.params.id);
      return res.json({
        status: true,
        message: MessageConstants.general.deleted,
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

  /**
   * @swagger
   * /taracker/detail/{id}:
   *  get:
   *    summary: Track task by id
   *    tags: [Task-Tracker]
   *    consumes:
   *      application/json
   *    produce:
   *      application/json
   *    description: get task detail by id
   *    parameters:
   *         - $ref: '#/components/parameters/id'
   *    responses:
   *      '200':
   *        description: Success
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                  status:
   *                    type: boolean
   *                    example: true
   *                  message:
   *                   type: string
   *                   example: 'Task detail'
   */
  async getTaskDetailById(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await taskManagerSvc.getTaskList({}, req.params.id);
      return res.json({
        status: true,
        message: MessageConstants.general.dataFetch,
        data: result,
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

  /**
   * @swagger
   * /tracker/matrics:
   *  get:
   *    summary: To get matrics detail
   *    tags: [Task-Tracker]
   *    consumes:
   *      application/json
   *    produce:
   *      application/json
   *    description: Get matrics summary
   *    responses:
   *      '200':
   *        description: Success
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                  status:
   *                    type: boolean
   *                    example: true
   *                  message:
   *                   type: string
   *                   example: 'Matrics detail'
   */
  async getTaskMaatric(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await taskManagerSvc.getTaskMatric();
      return res.json({
        status: true,
        message: MessageConstants.general.dataFetch,
        data: result,
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

  /**
   * @swagger
   * /tracker/detail/{id}:
   *  patch:
   *    summary: Update task detail
   *    tags: [Task-Tracker]
   *    consumes:
   *      application/json
   *    produce:
   *      application/json
   *    description: To update task detail by id
   *    parameters:
   *         - $ref: '#/components/parameters/id'
   *    requestBody:
   *     content:
   *      application/json:
   *    responses:
   *      '200':
   *        description: Success
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                  status:
   *                    type: boolean
   *                    example: true
   *                  message:
   *                   type: string
   *                   example: 'updated successfully'
   */
  async updateTask(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await taskManagerSvc.updateTask(req.body);
      return res.json({
        status: true,
        message: MessageConstants.general.updated,
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

  /**
   * @swagger
   * /tracker/list:
   *  get:
   *    summary: Task details
   *    tags: [Task-Tracker]
   *    consumes:
   *      application/json
   *    produce:
   *      application/json
   *    description: Get task list
   *    parameters:
   *         - $ref: '#/components/parameters/pageNumber'
   *         - $ref: '#/components/parameters/pageSize'
   *    responses:
   *      '200':
   *        description: Success
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                  status:
   *                    type: boolean
   *                    example: true
   *                  message:
   *                   type: string
   *                   example: 'data fetched'
   */
  async getTaskList(req: Request, res: Response, next: NextFunction) {
    try {
      const filter = {
        pageSize: req.query.pageSize,
        pageNumber: req.query.pageNumber,
      };
      const result = await taskManagerSvc.getTaskList(filter);
      return res.json({
        status: true,
        message: MessageConstants.general.dataFetch,
        metadata: {
          pageNumber: filter.pageNumber ?? 0,
          pageSize: result.length,
        },
        data: result,
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

  /**
   * @swagger
   * /tracker/:
   *  post:
   *   summary: To create task
   *   description: api to allow user to create task
   *   tags: [Task-Tracker]
   *   requestBody:
   *    content:
   *     application/json:
   *      schema:
   *       $ref: '#/definitions/registerInstitute'
   *   responses:
   *    '200':
   *       description: success
   *
   *
   */

  async addTask(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await taskManagerSvc.createTask(req.body);
      return res.json({
        status: true,
        message: MessageConstants.general.saved,
        data: result,
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

  /**
   * @swagger
   * /tracker/matricsByDate:
   *  get:
   *    summary: Matrics summary
   *    tags: [Task-Tracker]
   *    consumes:
   *      application/json
   *    produce:
   *      application/json
   *    description: To get matrics summary by date
   *    responses:
   *      '200':
   *        description: Success
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                  status:
   *                    type: boolean
   *                    example: true
   *                  message:
   *                   type: string
   *                   example: 'Matrics summary fetched'
   */
  async getTaskMaatricByDate(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await taskManagerSvc.getTaskMatric(true);
      return res.json({
        status: true,
        message: MessageConstants.general.dataFetch,
        data: result,
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
