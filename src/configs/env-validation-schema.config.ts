import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  APP_PORT: Joi.number().required(),

  DB_TYPE: Joi.string().valid('postgres').required(),
  DB_HOST: Joi.string().hostname().required(),
  DB_PORT: Joi.number().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DB_SYNCHRONIZE: Joi.boolean(),
  DB_LOGGING: Joi.boolean(),
  DB_ENTITIES: Joi.string().required(),
  DB_MIGRATIONS: Joi.string().required(),
});
