const validateBody = schema => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message)
  };
  return next();
};

const validateParams = schema => (req, res, next) => {
  const { error } = schema.validate(req.params)
  if (error) {
    return res.status(400).send(error.details[0].message)
  }
  return next()
};

const validateQueries = schema => (req, res, next) => {
  const { error } = schema.validate(req.query)
  if (error) {
    return res.status(400).send(error.details[0].message)
  }
  return next()
};

module.exports = {
  validateBody,
  validateParams,
  validateQueries,
};