// src/services/card.service.js

const {
  find,
  findMyCards,
  findOne,
  findLikedCards,
  create,
  update,
  like,
  remove,
} = require("../dal/card.dal");
const { validateCard } = require("../validation/validators");
const normalizedCard = require("../helpers/normalize-card");

// Service function to interact with the card data access layer
const getCards = async () => {
  try {
    const cards = await find();
    return Promise.resolve(cards);
  } catch (error) {
    return Promise.reject(error);
  }
};

// Service function to get cards for a specific user
const getMyCards = async (userId) => {
  try {
    const cards = await findMyCards(userId);
    return Promise.resolve(cards);
  } catch (error) {
    return Promise.reject(error);
  }
};

// Service function to get a specific card by ID
const getCardById = async (cardId) => {
  try {
    const card = await findOne(cardId);
    return Promise.resolve(card);
  } catch (error) {
    return Promise.reject(error);
  }
};

// Service function to get cards liked by a specific user
const getLikedCards = async (userId) => {
  try {
    const cards = await findLikedCards(userId);
    return Promise.resolve(cards);
  } catch (error) {
    return Promise.reject(error);
  }
};

// Service function to create a new card
const createCard = async (rawCard, userId) => {
  try {
    const { error } = validateCard(rawCard);
    if (error) {
      return Promise.reject(error);
    }
    let card = await normalizedCard(rawCard, userId);
    card = await create(card);
    return Promise.resolve(card);
  } catch (error) {
    return Promise.reject(error);
  }
};

// Service function to update a card by ID
const updateCard = async (cardId, rawCard) => {
  try {
    const { error } = validateCard(rawCard);
    if (error) {
      return Promise.reject(error);
    }
    const { password, isAdmin, _id, __v, createdAt, ...rest } = rawCard;
    const cardPayload = await normalizedCard(rest);
    const card = await update(cardId, cardPayload);
    return Promise.resolve(card);
  } catch (error) {
    return Promise.reject(error);
  }
};

// Service function to like a card by ID
const likeCard = async (cardId, userId) => {
  try {
    const card = await like(cardId, userId);
    return Promise.resolve(card);
  } catch (error) {
    return Promise.reject(error);
  }
};

// Service function to delete a card by ID
const deleteCard = async (cardId) => {
  try {
    const deleted = await remove(cardId);
    return Promise.resolve(deleted);
  } catch (error) {
    return Promise.reject(error);
  }
};

module.exports = {
  getCards,
  getMyCards,
  getCardById,
  getLikedCards,
  createCard,
  updateCard,
  likeCard,
  deleteCard,
};
