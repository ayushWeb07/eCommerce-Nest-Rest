import * as Joi from 'joi';

export default Joi.object({
  SERVER_PORT: Joi.number().required().port(),
  MONGO_URI: Joi.string().required(),
  MONGO_DB_NAME: Joi.string().required(),
});
