import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  // Configurações do Servidor
  APP_PORT: Joi.number().required(),

  // Configurações do Banco de Dados
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

  // Configurações de Segurança (CORS)
  CORS_ORIGIN: Joi.string().default('*'), // Permitindo todos os domínios por padrão
  CORS_METHODS: Joi.string().default('GET,HEAD,PUT,PATCH,POST,DELETE'), // Métodos permitidos por padrão
  CORS_ALLOWED_HEADERS: Joi.string().default('Content-Type,Authorization'), // Cabeçalhos permitidos por padrão

  // Configurações de Rate Limiting
  RATE_LIMIT_TTL: Joi.number().default(60).min(1), // Tempo da janela de requisições (em segundos)
  RATE_LIMIT_MAX: Joi.number().default(10).min(1), // Máximo de requisições permitidas no tempo
});
