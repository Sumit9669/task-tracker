import { HttpStatusCodes } from 'src/enums/common-enums';
import { IGeneralHttpExceptions } from 'src/interfaces-and-types';
import MessageConstants from '@constants/response.constants';
import { ExceptionsTerminology } from '@constants/common.constants';


export const GeneralHttpExceptions: IGeneralHttpExceptions = {

    EntityNotFoundException: {
        errorCode: 1001,
        message: MessageConstants.general.entityNotFound,
        type: ExceptionsTerminology.entityNotFound,
        statusCode: HttpStatusCodes.badRequest
    },
    ValidationException: {
        errorCode: 1002,
        message: MessageConstants.general.invalidRequestParameters,
        type: ExceptionsTerminology.validationException,
        statusCode: HttpStatusCodes.badRequest
    },
    InternalServerException: {
        errorCode: 1003,
        message: MessageConstants.general.somethingWrong,
        type: ExceptionsTerminology.internalServerException,
        statusCode: HttpStatusCodes.internalServerError
    },
    HeaderMissingError: {
        errorCode: 1009,
        message: MessageConstants.general.headerMissingError,
        type: ExceptionsTerminology.headerMissing,
        statusCode: HttpStatusCodes.badRequest
    },
    NotFoundException: {
        errorCode: 1004,
        message: MessageConstants.general.notFound,
        type: ExceptionsTerminology.endPointNotFoundException,
        statusCode: HttpStatusCodes.notFound
    },
    ServiceUnavailableException: {
        errorCode: 1005,
        message: MessageConstants.general.serviceUnavailable,
        type: ExceptionsTerminology.serviceUnavailableException,
        statusCode: HttpStatusCodes.notFound
    },
    AuthenticationException: {
        errorCode: 1008,
        message: MessageConstants.general.missingHeaders,
        type: ExceptionsTerminology.unAuthorisedTokenException,
        statusCode: HttpStatusCodes.unauthorized
    },
    DatabaseException: {
      errorCode: 1021,
      message: MessageConstants.general.somethingWrong,
      type: ExceptionsTerminology.internalServerException,
      statusCode: HttpStatusCodes.internalServerError
    }
};

