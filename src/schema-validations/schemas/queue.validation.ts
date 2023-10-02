import Joi from 'joi';
const QueueMetaData = Joi.object().keys({
    businessId: Joi.string().trim().required().allow(''),
    timestamp: Joi.string().trim().required(),
    entity: Joi.string().trim().required(),
    operation: Joi.string().trim().required(),
    destination: Joi.string().trim().required(),
    source: Joi.string().trim().required(),
    instituteId: Joi.string().trim().required().allow(''),
    reloadType: Joi.number(),
    query: Joi.string(),
    bankAccountId: Joi.string()
});


export const QueueDataSchema = Joi.object().keys({
    metadata: QueueMetaData,
    data: Joi.alternatives().try(Joi.object(), Joi.array()).required()
});

export const DapQueueDataSchema = Joi.object().keys({
    metadata: QueueMetaData,
    data: Joi.array().required()
});