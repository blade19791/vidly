import Joi from "joi";

export const userSchema = Joi.object({
  name: Joi.string().min(2).max(255).required(),

  email: Joi.string().email().max(255).required(),

  password: Joi.string().min(6).max(255).required(),
});
