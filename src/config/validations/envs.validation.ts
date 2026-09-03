import * as Joi from 'joi';

export default Joi.object({
  SERVER_PORT: Joi.number().required().port(),
  MONGO_URI: Joi.string().required(),
  MONGO_DB_NAME: Joi.string().required(),
  DRIZZLE_URI: Joi.string().required(),
  USE_DB: Joi.string().valid('postgres', 'mongo').required(),
  NODEMAILER_SMTP_HOST: Joi.string().required(),
  NODEMAILER_SMTP_PORT: Joi.number().required().port(),
  NODEMAILER_SMTP_USERNAME: Joi.string().required(),
  NODEMAILER_SMTP_PASSWORD: Joi.string().required(),
  NODEMAILER_SMTP_FROM: Joi.string().email().required(),
});
