// server.js

const express = require("express");
const app = express();
const router = require("./src/controllers/router");
const cors = require("./src/middlewares/cors.middlewares");
const { errorHandler } = require("./src/utils/error-handler");
const logger = require("./src/utils/http-logger");
const connectToDb = require("./src/db/db-service");
const config = require("config");
const {
  generateInitialCards,
  generateInitialUsers,
} = require("./src/mocks/initial-data-service");

//middleware app level
app.use(cors);
app.use(logger);
app.use(express.json());
app.use(express.text());
app.use(express.static("./public"));
app.use(router);

//error handler middleware
app.use((err, req, res, next) => {
  errorHandler(res, err.status || 500, err.massage);
});

//start server
const PORT = config.get("PORT");
app.listen(PORT, () => {
  console.log(`init server on: http://localhost:${PORT}`);
  connectToDb();
  generateInitialCards();
  generateInitialUsers();
});
