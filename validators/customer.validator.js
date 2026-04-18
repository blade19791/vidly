import Joi from "joi";

export const customerSchema = Joi.object({
  isGold: Joi.bool().required(),
  name: Joi.string().max(255).min(3).required(),
  phone: Joi.string().max(13).min(0).required(),
});
