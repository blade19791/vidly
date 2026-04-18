import Joi from "joi";

export const movieSchema = Joi.object({
  title: Joi.string().min(2).max(255).required(),
  genreId: Joi.number().integer().min(1).max(5).required(),
  numberInStock: Joi.number().integer().min(0).required(),
  dailyRentalRate: Joi.number().min(0).required(),
});
