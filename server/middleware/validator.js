const joi = require('joi');

const validator = (schema) => (payload) => {
   return schema.validate(payload, { abortEarly: false })}

const UserSchema = joi.object({
  username: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().min(3).max(18).required(),
}).unknown(true);;

const loginSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(3).max(18).required(),
}).unknown(false);

const validateUser = validator(UserSchema)
const validateLogin = validator(loginSchema)
module.exports =  {validateUser, validateLogin}