const { verifyToken } = require("../helpers/auth-token");
const { errorHandler } = require("../utils/error-handler");
const config = require("config");
const tokenGenerator = config.get("TOKEN_GENERATOR") || "jwt";

//auth service middleware
const authService = (req, res, next) => {
  if (tokenGenerator === "jwt") {
    try {
      const token = req.header("x-auth-token");
      if (!token) {
        throw new Error("Access denied. No token provided.");
      }
      const userData = verifyToken(token);
      if (!userData) {
        throw new Error("Invalid token.");
      }
      req.user = userData;
      return next();
    } catch (error) {
      return errorHandler(res, 401, error.message);
    }
  }
  return errorHandler(res, 500, "Invalid token generator");
};

module.exports = authService;
