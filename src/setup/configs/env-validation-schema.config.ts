import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  // Server Configurations
  APP_PORT: Joi.number().required(),

  // Database Configurations
  DB_TYPE: Joi.string().valid('postgres').required(),
  DB_HOST: Joi.string().hostname().required(),
  DB_PORT: Joi.number().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DB_SYNCHRONIZE: Joi.boolean().default(false),
  DB_LOGGING: Joi.boolean().default(true),
  DB_ENTITIES: Joi.string().required(),
  DB_MIGRATIONS: Joi.string().required(),

  // Security Configurations (CORS)
  CORS_ORIGIN: Joi.string().default('*'), // Allowing all domains by default
  CORS_METHODS: Joi.string().default('GET,HEAD,PUT,PATCH,POST,DELETE'), // Allowed methods by default
  CORS_ALLOWED_HEADERS: Joi.string().default('Content-Type,Authorization'), // Allowed headers by default

  // Rate Limiting Configurations
  RATE_LIMIT_TTL: Joi.number().default(60).min(1), // Request window time (in seconds)
  RATE_LIMIT_MAX: Joi.number().default(10).min(1), // Maximum allowed requests in the time window
});
