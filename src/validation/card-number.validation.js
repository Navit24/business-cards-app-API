// src/validation/card-number.validation.js

const Joi = require("joi");

const validateCardNumberWithJoi = (payload) => {
  const schema = Joi.object({
    bizNumber: Joi.number().integer().min(1).max(999999999).required(),
  });

  return schema.validate(payload);
};

module.exports = validateCardNumberWithJoi;
