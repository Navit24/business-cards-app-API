// src/controllers/router.js

const express = require("express");
const router = express.Router();
const cardRestController = require("./card.controller");
const userRestController = require("./user.controller");
const { errorHandler } = require("../utils/error-handler");

// Mount the card and user controllers
router.use("/cards", cardRestController);
router.use("/users", userRestController);

// Handle 404 errors for undefined routes
router.use((req, res) => {
  errorHandler(res, 404, "Page Not Found!");
});

module.exports = router;
