// src/validation/login.validation.js

const Joi = require("joi");

// Function to validate login data using Joi
const validateLoginWithJoi = (loginData) => {
  const schema = Joi.object({
    email: Joi.string()
      .ruleset.regex(
        /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
      )
      .rule({ message: "Email must be a valid email address" })
      .required(),
    password: Joi.string()
      .min(7)
      .ruleset.regex(
        /((?=.*\d{1})(?=.*[A-Z]{1})(?=.*[a-z]{1})(?=.*[!@#$%^&*-]{1}).{7,20})/
      )
      .rule({
        message:
          "password must be 7 characters long, include at least one uppercase letter, one lowercase letter, one digit, and one special character",
      })
      .required(),
  });
  return schema.validate(loginData);
};

module.exports = validateLoginWithJoi;
