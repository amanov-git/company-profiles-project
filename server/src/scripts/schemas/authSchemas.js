const joi = require('joi');

const registerSchema = joi.object({
  username: joi.string().required(),
  fullname: joi.string().required(),
  password: joi.string().required(),
  titleID: joi.number().required(),
});

const loginSchema = joi.object({
  username: joi.string().required(),
  password: joi.string().required(),
});

module.exports = {
  registerSchema,
  loginSchema,
};