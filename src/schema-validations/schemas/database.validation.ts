import Joi from 'joi';

const InstituteDbCreateSchema = Joi.object({
    dbName: Joi.string().required()
});

const busiessDbCreateSchema = Joi.object({
    businessId: Joi.string().required()
});

const migrationSchema = Joi.object({
    migration: Joi.string().required()
});

export const DatabaseValidations =
{
    InstituteDbCreateSchema,
    busiessDbCreateSchema,
    migrationSchema
};
