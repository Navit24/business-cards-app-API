// src/mocks/initial-data-service.js

const data = require("./initial-data.json");
const normalizeUser = require("../helpers/normalize-user");
const normalizeCard = require("../helpers/normalize-card");
const { register } = require("../dal/user.dal");
const { create } = require("../dal/card.dal");
const { generateUserPassword } = require("../helpers/hash-password");
const chalk = require("chalk");

// Function to generate initial cards from the JSON data
const generateInitialCards = async () => {
  const { cards } = data;
  cards.forEach(async (card) => {
    try {
      const userId = "64a7f0f4c8e4f2b4d6e4f0a1"; // temp userId until users are created
      card = await normalizeCard(card, userId);
      await create(card);
      return;
    } catch (error) {
      console.log(chalk.red(error.message));
    }
  });
};

// Function to generate initial users from the JSON data
const generateInitialUsers = async () => {
  const { users } = data;
  users.forEach(async (user) => {
    try {
      user = await normalizeUser(user);
      user.password = generateUserPassword(user.password);
      await register(user);
      return;
    } catch (error) {
      return console.log(chalk.redBright(error.message));
    }
  });
};

module.exports = {
  generateInitialCards,
  generateInitialUsers,
};
