//src/db/connect-atlas.js

const mongoose = require("mongoose");
const chalk = require("chalk");
const config = require("config");
const userName = config.get("DB_USERNAME");
const password = config.get("DB_PASSWORD");

// Connect to MongoDB Atlas
mongoose
  .connect(
    `mongodb+srv://${userName}:${password}@cluster0.m9lts2a.mongodb.net/business_card_app`
  )
  .then(() => console.log(chalk.magentaBright("Connect To Atlas MongoDB!")))
  .catch((error) => {
    console.log(chalk.redBright(error));
  });
