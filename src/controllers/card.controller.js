// src/controllers/card.controller.js

const express = require("express");
const router = express.Router();
const { errorHandler } = require("../utils/error-handler");
const {
  getCards,
  getMyCards,
  getCardById,
  getLikedCards,
  createCard,
  updateCard,
  likeCard,
  deleteCard,
} = require("../services/card.service");
const authService = require("../middlewares/auth.middleware");

// Route to get all cards
router.get("/", async (req, res) => {
  try {
    const cards = await getCards();
    return res.send(cards);
  } catch (error) {
    return errorHandler(res, error.status || 500, error.message);
  }
});

// Route to get my cards
router.get("/my-cards", authService, async (req, res) => {
  try {
    const userId = req.user._id;
    const { isBusiness } = req.user;
    if (!isBusiness) {
      return errorHandler(res, 403, "Access denied. Business only.");
    }

    const cards = await getMyCards(userId);
    return res.send(cards);
  } catch (error) {
    return errorHandler(res, error.status || 500, error.message);
  }
});

// Route to get liked cards
router.get("/liked-cards", authService, async (req, res) => {
  try {
    const userId = req.user._id;
    const cards = await getLikedCards(userId);
    return res.send(cards);
  } catch (error) {
    return errorHandler(res, error.status || 500, error.message);
  }
});

// Route to get a specific card by Id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const card = await getCardById(id);
    return res.send(card);
  } catch (error) {
    return errorHandler(res, error.status || 500, error.message);
  }
});

// Route to create a new card
router.post("/", authService, async (req, res) => {
  try {
    const { _id, isBusiness } = req.user;
    if (!isBusiness) {
      return errorHandler(res, 401, "Access denied. Business only.");
    }
    const normalizedCard = req.body;
    const newCard = await createCard(normalizedCard, _id);
    return res.status(201).send(newCard);
  } catch (error) {
    return errorHandler(res, error.status || 500, error.message);
  }
});

// Route to update a card by Id
router.put("/:id", authService, async (req, res) => {
  try {
    const { id } = req.params;
    const { _id, isBusiness, isAdmin } = req.user;

    const existingCard = await getCardById(id);
    const isOwner = String(existingCard.user_id) === String(_id);
    if (!isAdmin && !(isBusiness && isOwner)) {
      return errorHandler(
        res,
        403,
        "Access denied. Owner Business or admin only."
      );
    }
    const normalizedCard = req.body;
    const card = await updateCard(id, normalizedCard);
    return res.send(card);
  } catch (error) {
    return errorHandler(res, error.status || 500, error.message);
  }
});

// Route to like a card by Id
router.patch("/:id", authService, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const likedCard = await likeCard(id, userId);
    return res.send(likedCard);
  } catch (error) {
    return errorHandler(res, error.status || 500, error.message);
  }
});

// Route to delete a card by Id
router.delete("/:id", authService, async (req, res) => {
  try {
    const { id } = req.params;
    const { _id, isBusiness, isAdmin } = req.user;
    const existingCard = await getCardById(id);
    const isOwner = String(existingCard.user_id) === String(_id);
    const isOwnerBusiness = isOwner && Boolean(isBusiness);
    if (!isAdmin && !isOwnerBusiness) {
      return errorHandler(
        res,
        403,
        "Access denied. Owner Business or admin only."
      );
    }
    const card = await deleteCard(id);
    return res.send(card);
  } catch (error) {
    return errorHandler(res, error.status || 500, error.message);
  }
});

module.exports = router;
