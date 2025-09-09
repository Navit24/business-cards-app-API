const express = require("express");
const app = express();
const morganLogger = require("../middlewares/morgan-logger.middleware");

const LOGGER = "morgan";

if (LOGGER === "morgan") {
  app.use(morganLogger);
}

module.exports = app;
