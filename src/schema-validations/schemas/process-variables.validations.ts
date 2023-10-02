import Joi from "joi";

export const ProcessEnvKeysSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().trim().required(),
    DBMS_SERVICE_PORT: Joi.string().trim().required(),
    HOST: Joi.string().trim().required(),
    DB_USER: Joi.string().trim().required(),
    DB_PASS: Joi.string().trim().required(),
    DB_HOST: Joi.string().trim().required(),
    DB_PORT: Joi.string().trim().required(),
    AXIOS_TIMEOUT: Joi.string().trim().required(),
    DBMS_SERVICE_NAME: Joi.string().trim().required(),
  })
  .options({ allowUnknown: true });
