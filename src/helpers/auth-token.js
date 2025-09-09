const jwt = require("jsonwebtoken");
const config = require("config");

// Database configuration
const key = config.get("JWT_KEY");
const expiresIn = config.get("JWT_EXPIRES_IN");

//generate token
const generateAuthToken = (user) => {
  const { _id, isAdmin, isBusiness } = user;
  const token = jwt.sign({ _id, isAdmin, isBusiness }, key, { expiresIn });
  return token;
};

//verify token
const verifyToken = (token) => {
  try {
    const userData = jwt.verify(token, key);
    return userData;
  } catch (err) {
    return null;
  }
};

module.exports = { generateAuthToken, verifyToken };
