// src/controllers/user.controller.js

const express = require("express");
const router = express.Router();
const { errorHandler } = require("../utils/error-handler");
const {
  registerUser,
  loginUser,
  getUsers,
  getUserById,
  updateUser,
  changeUserIsBizStatus,
  deleteUser,
} = require("../services/user.service");
const authService = require("../middlewares/auth.middleware");

// Route to register a new user
router.post("/", async (req, res) => {
  try {
    const userData = req.body;
    const user = await registerUser(userData);
    return res.status(201).send(user);
  } catch (error) {
    return errorHandler(res, error.status || 500, error.message);
  }
});

// Route to login a user
router.post("/login", async (req, res) => {
  try {
    const loginData = req.body;
    const user = await loginUser(loginData);
    return res.status(200).send(user);
  } catch (error) {
    return errorHandler(res, error.status || 500, error.message);
  }
});

// Route to get all users
router.get("/", authService, async (req, res) => {
  try {
    const { isAdmin } = req.user;
    if (!isAdmin) {
      return errorHandler(res, 403, "Access denied. Admins only.");
    }
    const users = await getUsers();
    return res.status(200).send(users);
  } catch (error) {
    return errorHandler(res, error.status || 500, error.message);
  }
});

// Route to get a specific user by ID
router.get("/:id", authService, async (req, res) => {
  try {
    const { id } = req.params;
    const { _id, isAdmin } = req.user;
    if (id !== _id && !isAdmin) {
      return errorHandler(res, 403, "Access denied. Admins only.");
    }
    const user = await getUserById(id);
    return res.send(user);
  } catch (error) {
    return errorHandler(res, error.status || 500, error.message);
  }
});

// Route to update a user by ID
router.put("/:id", authService, async (req, res) => {
  try {
    const { id } = req.params;
    const { _id, isAdmin } = req.user;
    if (id !== _id && !isAdmin) {
      return errorHandler(res, 403, "Access denied. Admins only.");
    }
    const userData = req.body;
    const user = await updateUser(id, userData);
    return res.send(user);
  } catch (error) {
    return errorHandler(res, error.status || 500, error.message);
  }
});

// Route to change a user's business status
router.patch("/:id", authService, async (req, res) => {
  try {
    const { id } = req.params;
    const { _id, isAdmin } = req.user;
    if (id !== _id && !isAdmin) {
      return errorHandler(res, 403, "Access denied. Admins only.");
    }
    const user = await changeUserIsBizStatus(id);
    return res.send(user);
  } catch (error) {
    return errorHandler(res, error.status || 500, error.message);
  }
});

// Route to delete a user by ID
router.delete("/:id", authService, async (req, res) => {
  try {
    const { id } = req.params;
    const { _id, isAdmin } = req.user;
    if (id !== _id && !isAdmin) {
      return errorHandler(res, 403, "Access denied. Admins only.");
    }

    const user = await deleteUser(id);
    return res.send(user);
  } catch (error) {
    return errorHandler(res, error.status || 500, error.message);
  }
});

module.exports = router;
