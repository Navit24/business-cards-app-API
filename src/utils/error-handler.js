const chalk = require("chalk");

// Generic error handler
const errorHandler = (res, status, message = "") => {
  console.error(chalk.red(message));
  res.status(status).send(message);
};

// Bad request handler for validation errors
const handleBadRequest = async (validator, error) => {
  const errorMessage = `${validator} Error: ${error.message}`;
  error.message = errorMessage;
  error.status = error.status || 400;
  return Promise.reject(error);
};

module.exports = { errorHandler, handleBadRequest };
