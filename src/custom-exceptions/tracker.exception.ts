import MessageConstants from "@constants/response.constants";
import { HttpStatusCodes } from "src/enums/common-enums";
import { IHttpException } from "src/interfaces-and-types";
import { ExceptionsTerminology } from "@constants/common.constants";

// Global error object
class TaskTrackerException extends Error {
  statusCode: HttpStatusCodes;
  type: string;
  stackTrace?: any;
  serviceCode?: number;
  errorCode: number;
  detailedMessage: string;
  smTraceId?: string;
  level?: string;
  forwardErrorDetails?: string;
  requestObject?: Express.Request;
  constructor(
    exception: IHttpException,
    message: string,
    stack?: string,
    originalError?: any | undefined
  ) {
    super(message);
    this.message = exception.message;
    this.detailedMessage = message || MessageConstants.general.somethingWrong;
    this.statusCode =
      exception.statusCode || HttpStatusCodes.internalServerError;
    this.type = exception.type || ExceptionsTerminology.internalServerException;
    if (originalError && originalError.isAxiosError) {
      const internalServiceErrorDetail: any = {};
      internalServiceErrorDetail.url = originalError.config.url;
      if (originalError.code === "ENOTFOUND") {
        internalServiceErrorDetail.message = MessageConstants.general.notFound;
      } else if (originalError.code === "ECONNREFUSED") {
        internalServiceErrorDetail.message =
          MessageConstants.general.serviceUnavailable;
      } else if (
        originalError.response &&
        originalError.response.status &&
        originalError.response.status === HttpStatusCodes.unauthorized
      ) {
        internalServiceErrorDetail.message = originalError.response.data
          ? originalError.response.data.message
          : MessageConstants.general.unAuthorisedToken;
        internalServiceErrorDetail.errorDetail = originalError.response.data
          .forwardErrorDetails
          ? originalError.response.data.forwardErrorDetails
          : "No detail found";
      } else if (
        originalError.response &&
        originalError.response.data &&
        originalError.response.data.error
      ) {
        (internalServiceErrorDetail.smTraceId =
          originalError.response.data.error &&
          originalError.response.data.error.smTraceId
            ? originalError.response.data.error.smTraceId
            : "No trace Id"),
          (internalServiceErrorDetail.errorDetail =
            originalError.response.data.forwardErrorDetails ||
            "No detail found"),
          (internalServiceErrorDetail.error =
            originalError.response.data.error &&
            originalError.response.data.error.smTraceId
              ? undefined
              : originalError.response.data.error);
      } else if (
        originalError.response &&
        originalError.response.status &&
        originalError.response.statusText
      ) {
        (internalServiceErrorDetail.message =
          originalError.response.statusText ||
          MessageConstants.general.somethingWrong),
          (internalServiceErrorDetail.type =
            ExceptionsTerminology.generalException),
          (internalServiceErrorDetail.statusCode =
            originalError.response.status ||
            HttpStatusCodes.internalServerError),
          (internalServiceErrorDetail.errorCode = 1000);
      }
      const errorDetail = {
        errorStack: stack || "No Stack Trace",
        internalServiceTrace: internalServiceErrorDetail,
      };
      this.stackTrace = errorDetail;
    } else {
      this.stackTrace = {
        errorStack: stack || "No Stack Trace",
        internalServiceTrace: null,
      };
    }
    this.serviceCode = Number(process.env.DBMS_SERVICE_CODE);
    this.errorCode = exception.errorCode;
  }
}

export default TaskTrackerException;
