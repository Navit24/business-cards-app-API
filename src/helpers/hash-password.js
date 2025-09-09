// src/helpers/hash-password.js

const bcrypt = require("bcryptjs");
const config = require("config");

// Database configuration
const saltRounds = config.get("BCRYPT_SALT_ROUNDS");

// Generate a hashed password from a plain text password
const generateUserPassword = (password) => {
  return bcrypt.hashSync(password, saltRounds);
};

// Compare a plain text password with a hashed password
const compareUserPassword = (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword);
};

module.exports = { generateUserPassword, compareUserPassword };
