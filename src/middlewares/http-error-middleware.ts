// Module imports
import { NextFunction, Request, Response } from "express";
import { ExpressJoiError } from "express-joi-validation";

// File imports
import logger from "@shared/logger";
import { HttpStatusCodes } from "src/enums/common-enums";
import { CommonFunctions } from "@shared/common-functions";
import MessageConstants from "@constants/response.constants";
import { HttpService } from "@shared/http.service";
import { GeneralHttpExceptions } from "src/custom-exceptions/general-exceptions.constants";
import { IHttpException } from "src/interfaces-and-types";
import { ExceptionsTerminology } from "@constants/common.constants";
import TaskTrackerException from "src/custom-exceptions/tracker.exception";
import { OperationType } from "src/enums/operation-types";

const commonFunctions = new CommonFunctions();
const httpService = new HttpService();
/**
 * will handle the Global Http Errors
 * @param error error of error class Type
 * @param request request of Express Request Type
 * @param response response of Express Response Type
 * @param next next function of Express response Type
 */
const HttpErrorMiddleware = async (
  error: TaskTrackerException | Error | ExpressJoiError | any,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  if (error instanceof TaskTrackerException) {
    HandleException(error, request, response);
  } else if (error.isAxiosError) {
    if (error.code === "ENOTFOUND") {
      const newError = new TaskTrackerException(
        GeneralHttpExceptions.NotFoundException,
        MessageConstants.general.notFound,
        error.stack
      );
      HandleException(newError, request, response);
    } else if (error.code === "ECONNREFUSED") {
      const newError = new TaskTrackerException(
        GeneralHttpExceptions.ServiceUnavailableException,
        MessageConstants.general.serviceUnavailable + error.config.url,
        error.stack
      );
      HandleException(newError, request, response);
    } else if (
      error &&
      error.response &&
      error.response.data.error &&
      error.response.data.message
    ) {
      const err = Object.assign(error.response.data.error, {
        statusCode: error.response.status,
      });
      const exception = new TaskTrackerException(
        err,
        error.response.data.message,
        error.stack
      );
      HandleException(exception, request, response);
    } else if (
      error.response &&
      error.response.status &&
      error.response.status === HttpStatusCodes.unauthorized
    ) {
      const exception = new TaskTrackerException(
        GeneralHttpExceptions.AuthenticationException,
        MessageConstants.general.unAuthorisedToken,
        error.stack
      );
      HandleException(exception, request, response);
    } else if (
      error.response &&
      error.response.status &&
      error.response.statusText
    ) {
      const exception: IHttpException = {
        message:
          error.response.statusText || MessageConstants.general.somethingWrong,
        type: ExceptionsTerminology.generalException,
        statusCode:
          error.response.status || HttpStatusCodes.internalServerError,
        errorCode: 1000,
      };
      HandleException(exception, request, response);
    } else {
      const err = new TaskTrackerException(
        GeneralHttpExceptions.InternalServerException,
        MessageConstants.general.somethingWrong,
        error.stack
      );
      HandleException(err, request, response);
    }
    // handle other case for axios error
  } else if (error && error.error && error.error.isJoi) {
    let validationError: TaskTrackerException;
    if (error.type === "headers") {
      validationError = new TaskTrackerException(
        GeneralHttpExceptions.HeaderMissingError,
        error.error.message,
        error.stack
      );
    } else {
      validationError = new TaskTrackerException(
        GeneralHttpExceptions.ValidationException,
        error.error.message,
        error.stack
      );
    }

    HandleException(validationError, request, response);
  } else {
    const newError = new TaskTrackerException(
      GeneralHttpExceptions.InternalServerException,
      error.message,
      error.stack
    );
    HandleException(newError, request, response);
  }
};

/**
 * will handle the Global Http Errors and send to client and store to db
 * @param error error of error class Type
 * @param request request of Express Request Type
 * @param response response of Express Response Type
 * @param next next function of Express response Type
 */
const HandleException = (error: any, request: Request, response: Response) => {
  const errorDetails: TaskTrackerException = {
    message: error.detailedMessage || MessageConstants.general.somethingWrong,
    type: error.type,
    stackTrace: error.stackTrace || error.stack,
    name: error.name,
    smTraceId: error.smTraceId,
    detailedMessage: error.message,
    level: "error",
    errorCode: error.errorCode,
    serviceCode: error.serviceCode,
    statusCode: error.statusCode,
  };
  response
    .status(errorDetails.statusCode)
    .json({ status: false, message: errorDetails.message });
};

/**
 *  will fetch the important information from request object
 * @param request pass the request Object
 */
const GetRequestObjectDetails = (request: Request) => {
  return {
    headers: request.headers,
    url: request.url,
    originalUrl: request.originalUrl,
    params: request.params,
    queryParams: request.query,
    body: request.body,
    ip: request.ip,
    method: request.method,
  };
};

export default HttpErrorMiddleware;
