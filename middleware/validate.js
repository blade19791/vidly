const validate = (schema, property = "body") => {
  return (req, res, next) => {
    const data = req[property];

    const { error, value } = schema.validate(data, {
      abortEarly: true, // stop at first error
      stripUnknown: true, // remove unwanted fields
    });

    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
      });
    }

    // overwrite with cleaned data
    req[property] = value;

    next();
  };
};

export default validate;
