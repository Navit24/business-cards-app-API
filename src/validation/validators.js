// src/validation/validators.js

const validateCardWithJoi = require("./card.validation");
const validateCardNumberWithJoi = require("./card-number.validation");
const validateRegisterWithJoi = require("./register.validation");
const validateLoginWithJoi = require("./login.validation");
const userUpdateValidation = require("./user-update.validation");

const validator = "Joi";

const validateCard = (cardData) => {
  if (validator === "Joi") {
    return validateCardWithJoi(cardData);
  }
};
const validateCardNumber = (payload) => {
  if (validator === "Joi") {
    return validateCardNumberWithJoi(payload);
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
  validateCardNumber,
  validateRegisteration,
  validateLogin,
  validateUserUpdate,
};
