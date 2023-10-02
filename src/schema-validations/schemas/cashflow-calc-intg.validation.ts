import * as Joi from 'joi';

// #region add Business
const forcasting = Joi.object().keys({
    businessId: Joi.string().max(36).required(),
    issueDate: Joi.date().required(),
    transactionId: Joi.string().max(36).trim().required(),
    dueDate: Joi.date().required(),
    contactId: Joi.string().trim().required(),
    headId: Joi.number().required(),
    description: Joi.string().allow(''),
    accountId: Joi.string().trim().required(),
    amount: Joi.number().required()


});

const ForcastingRequest = Joi.object({
    forcastingData: Joi.array().items(forcasting),
});

// #endregion

export const CashflowValidations =
{
    ForcastingRequest,
};