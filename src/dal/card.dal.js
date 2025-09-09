// src/dal/card.dal.js

const CardModel = require("../models/card.model.js");
const { handleBadRequest } = require("../utils/error-handler.js");
const config = require("config");

// Database configuration
const DB = config.get("DB");

// Function to get all cards
const find = async () => {
  if (DB === "MONGODB") {
    try {
      const cards = await CardModel.find().sort({ createdAt: -1 });
      if (!cards) throw new Error("Could not find cards");
      return Promise.resolve(cards);
    } catch (error) {
      error.status = 404;
      return handleBadRequest("Mongoose", error);
    }
  }
  return Promise.resolve("get cards not in mongoDB");
};

// Function to get cards for a specific user
const findMyCards = async (userId) => {
  if (DB === "MONGODB") {
    try {
      const cards = await CardModel.find({ user_id: userId }).sort({
        createdAt: -1,
      });
      if (!cards) throw new Error("Could not find cards");
      return Promise.resolve(cards);
    } catch (error) {
      error.status = 400;
      return handleBadRequest("Mongoose", error);
    }
  }
  return Promise.resolve("get my cards not in mongoDB");
};

// Function to get a specific card by ID
const findOne = async (cardId) => {
  if (DB === "MONGODB") {
    try {
      let card = await CardModel.findById(cardId);
      if (!card) throw new Error("Could not find card with the given ID");
      return Promise.resolve(card);
    } catch (error) {
      error.status = 404;
      return handleBadRequest("Mongoose", error);
    }
  }
  return Promise.resolve("get card by id not in mongoDB");
};

// Function to get cards liked by a specific user
const findLikedCards = async (userId) => {
  if (DB === "MONGODB") {
    try {
      const cards = await CardModel.find({ likes: userId }).sort({
        createdAt: -1,
      });
      if (!cards) throw new Error("Could not find liked cards");
      return Promise.resolve(cards);
    } catch (error) {
      error.status = 400;
      return handleBadRequest("Mongoose", error);
    }
  }
  return Promise.resolve("get liked cards not in mongoDB");
};

// Function to create a new card
const create = async (normalizedCard) => {
  if (DB === "MONGODB") {
    try {
      const { email } = normalizedCard;
      let card = await CardModel.findOne({ email });
      if (card) throw new Error("Card already exists with this email");

      card = new CardModel(normalizedCard);
      card = await card.save();
      return Promise.resolve(card);
    } catch (error) {
      error.status = 404;
      return handleBadRequest("Mongoose", error);
    }
  }
  return Promise.resolve("create card not in mongoDB");
};

// Function to update an existing card
const update = async (cardId, normalizedCard) => {
  if (DB === "MONGODB") {
    try {
      let card = await CardModel.findByIdAndUpdate(cardId, normalizedCard, {
        new: true,
        runValidators: true,
      });
      if (!card) throw new Error("Could not find card with the given ID");
      return Promise.resolve(card);
    } catch (error) {
      error.status = 404;
      return handleBadRequest("Mongoose", error);
    }
  }
  return Promise.resolve("update card not in mongoDB");
};

// Function to like or unlike a card
const like = async (cardId, userId) => {
  if (DB === "MONGODB") {
    try {
      let card = await CardModel.findById(cardId);
      if (!card) throw new Error("Could not find card with the given ID");

      const userLiked = card.likes.some(
        (id) => id.toString() === userId.toString()
      );

      if (userLiked) {
        // User already liked the card - remove the like (unlike)
        card.likes = card.likes.filter(
          (id) => id.toString() !== userId.toString()
        );
      } else {
        // User hasn't liked the card - add the like
        card.likes.push(userId);
      }

      card = await card.save();
      return Promise.resolve(card);
    } catch (error) {
      error.status = 404;
      return handleBadRequest("Mongoose", error);
    }
  }
  return Promise.resolve("like card not in mongoDB");
};

// Function to remove a card
const remove = async (cardId) => {
  if (DB === "MONGODB") {
    try {
      const deletedCard = await CardModel.findByIdAndDelete(cardId);
      if (!deletedCard)
        throw new Error("Could not find card with the given ID");
      return Promise.resolve(deletedCard);
    } catch (error) {
      error.status = 404;
      return handleBadRequest("Mongoose", error);
    }
  }
  return Promise.resolve("remove card not in mongoDB");
};

module.exports = {
  find,
  findMyCards,
  findOne,
  findLikedCards,
  create,
  update,
  like,
  remove,
};
