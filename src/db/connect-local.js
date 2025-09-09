//src/db/connect-local.js

const mongoose = require("mongoose");
const chalk = require("chalk");

// Connect to local MongoDB instances
mongoose
  .connect("mongodb://127.0.0.1:27017/business_card_app")
  .then(() => console.log(chalk.magentaBright("Connect Locally To MongoDB!")))
  .catch((error) => {
    console.log(chalk.redBright(error));
  });
