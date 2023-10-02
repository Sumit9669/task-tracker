export const CommonFormat = {
  dateTime: "YYYY-MM-DD hh:mm:ss",
  date: "YYYY-MM-DD",
};

export const RedisKeys = {
  businesses: "{0}-usr-businesses",
  businessSyncDate: "{0}-syncDate",
  lastAvailableDate: "{0}-lastAvailableDate",
  firstAvailableDate: "{0}-firstAvailableDate",
  futureLastAvailableDate: "{0}-futureLastAvailableDate",
  businessStatus: "{0}-status",
};

export const TaskStatus = {
  open: 0,
  active: 1,
  inActive: 2,
};

export const ExceptionsTerminology = {
  recordAlreadyExists: "RecordExists",
  generalException: "GeneralError",
  entityNotFound: "EntityNotFoundError",
  entitiesNotFound: "EnititesNotFoundError",
  validationException: "RequestValidationError",
  internalServerException: "InternalServerError",
  headerMissing: "HeaderMissing",
  endPointNotFoundException: "EndPointNotFoundError",
  serviceUnavailableException: "EndPointNotFoundError",
  unAuthorisedTokenException: "UnAuthorisedTokenError",
  invalidRequest: "InvalidRequestError",
};
