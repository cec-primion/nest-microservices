import * as Joi from 'joi';
import { EnvironmentEnum } from '@app/common';
import { EnvConfig } from './env-variable.interface';

export const validationSchema = Joi.object<EnvConfig, true, EnvConfig>({
  NODE_ENV: Joi.string()
    .required()
    .valid(...Object.values(EnvironmentEnum)),
  PORT: Joi.number().required(),
  USE_SWAGGER: Joi.boolean().default(false),
  USE_COMPRESSION: Joi.boolean().required().default(true),
  LOG_LEVEL: Joi.string().required().default('info'),
  APP_VERSION: Joi.string().required(),

  DB_NAME: Joi.string().required(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),

  USERS_HOST: Joi.string().required(),
  USERS_PORT: Joi.number().required(),

  RABBIT_MQ_URI: Joi.string().required(),
});
