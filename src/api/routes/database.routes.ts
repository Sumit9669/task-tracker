// Module imports
import { Router, Request, Response } from "express";
import { NextFunction } from "express";
import { createValidator } from "express-joi-validation";

// Files imports
import { MessageConstants } from "@constants/response.constants";
import { GeneralHttpExceptions } from "src/custom-exceptions/general-exceptions.constants";
import TaskTrackerException from "src/custom-exceptions/tracker.exception";
import { MysqlConnectionService } from "src/services/mysql-connection.service";

const validator = createValidator({ passError: true });
const mysqlConnectionService = new MysqlConnectionService();

class DatabaseRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.mountRoutes();
  }

  private mountRoutes() {
    this.router.get("/mysql", this.createMySqlDatabase);
  }

  /**
   * @swagger
   * /mysql:
   *  get:
   *    summary: Create DB schema for app
   *    tags: [Database-Setup]
   *    consumes:
   *      application/json
   *    produce:
   *      application/json
   *    description: To setup db
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
   *                   example: 'Db schema created'
   */
  async createMySqlDatabase(req: Request, res: Response, next: NextFunction) {
    try {
      await mysqlConnectionService.createConnection();

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
export = new DatabaseRouter().router;
