import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'test', 'production').required(),

  PORT: Joi.number().default(3000),

  MONGODB_URI: Joi.string().required(),
  MONGODB_NAME: Joi.string().optional(),
  MONGODB_MAX_POOL_SIZE: Joi.string().optional(),

  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().required(),

  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_REFRESH_EXPIRES_IN: Joi.string().required(),

  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().required(),
  REDIS_PASSWORD: Joi.string().optional(),
  REDIS_MAX_RETRIES_PER_REQUEST: Joi.string().optional(),
});
