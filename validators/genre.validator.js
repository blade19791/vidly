import Joi from "joi";

export const genreSchema = Joi.object({
  name: Joi.string().max(50).min(3).required(),
});
