// src/validation/validators.js

const validateCardWithJoi = require("./card.validation");
const validateRegisterWithJoi = require("./register.validation");
const validateLoginWithJoi = require("./login.validation");
const userUpdateValidation = require("./user-update.validation");

const validator = "Joi";

const validateCard = (cardData) => {
  if (validator === "Joi") {
    return validateCardWithJoi(cardData);
  }
};
const validateRegisteration = (userData) => {
  if (validator === "Joi") {
    return validateRegisterWithJoi(userData);
  }
};
const validateLogin = (loginData) => {
  if (validator === "Joi") {
    return validateLoginWithJoi(loginData);
  }
};
const validateUserUpdate = (user) => {
  if (validator === "Joi") {
    return userUpdateValidation(user);
  }
};

module.exports = {
  validateCard,
  validateRegisteration,
  validateLogin,
  validateUserUpdate,
};
