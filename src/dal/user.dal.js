// src/dal/user.dal.js

const UserModel = require("../models/user.model");
const { compareUserPassword } = require("../helpers/hash-password");
const { handleBadRequest } = require("../utils/error-handler");
const { generateAuthToken } = require("../helpers/auth-token");
const lodash = require("lodash");
const config = require("config");

// Database configuration
const DB = config.get("DB");

// Function to register a new user
const register = async (normalizedUser) => {
  if (DB === "MONGODB") {
    try {
      const { email } = normalizedUser;
      let user = await UserModel.findOne({ email });
      if (user) throw new Error("User already exists with this email");

      user = new UserModel(normalizedUser);
      user = await user.save();

      user = lodash.pick(user, ["name", "email", "_id"]);
      return Promise.resolve(user);
    } catch (error) {
      error.status = 400;
      return handleBadRequest("Mongoose", error);
    }
  }
  return Promise.resolve("register user not in mongodb");
};

// Function to authenticate a user and generate a token
const login = async ({ email, password }) => {
  if (DB === "MONGODB") {
    try {
      const user = await UserModel.findOne({ email });
      if (!user) throw new Error("invalid email or password");

      // If account is locked and lock time hasn't passed
      if (user.lockUntil && user.lockUntil.getTime() > Date.now()) {
        const err = new Error("Account locked. try again later.");
        err.status = 423;
        throw err;
      }

      const validPassword = compareUserPassword(password, user.password);
      if (!validPassword) {
        user.loginAttempts = (user.loginAttempts || 0) + 1;

        if (user.loginAttempts >= 3) {
          user.lockUntil = new Date(Date.now() + 24 * 60 * 60 * 1000);

          user.loginAttempts = 0;
          user = await user.save();
          const err = new Error(
            "Account locked for 24 hours due to failed attempts."
          );
          err.status = 423;
          throw err;
        }
        user = await user.save();
        const err = new Error("invalid email or password");
        err.status = 400;
        throw err;
      }

      // success: reset attempt and lock
      user.loginAttempts = 0;
      user.lockUntil = null;
      user = await user.save();

      const token = generateAuthToken(user);
      return Promise.resolve(token);
    } catch (error) {
      error.status = 400;
      return handleBadRequest("Mongoose", error);
    }
  }
  return Promise.resolve("login user not in mongodb");
};

// Function to retrieve all users, excluding sensitive fields
const find = async () => {
  if (DB === "MONGODB") {
    try {
      const users = await UserModel.find({}, { password: 0, __v: 0 });
      return Promise.resolve(users);
    } catch (error) {
      error.status = 401;
      return handleBadRequest("Mongoose", error);
    }
  }
  return Promise.resolve("get all users not in mongodb");
};

// Function to retrieve a specific user by ID, excluding sensitive fields
const findOne = async (userId) => {
  if (DB === "MONGODB") {
    try {
      let user = await UserModel.findById(userId, { password: 0, __v: 0 });
      if (!user) throw new Error("User not found in DB");
      return Promise.resolve(user);
    } catch (error) {
      error.status = 401;
      return handleBadRequest("Mongoose", error);
    }
  }
  return Promise.resolve("get user by id not in mongodb");
};

// Function to update a user's information
const update = async (userId, normalizedUser) => {
  if (DB === "MONGODB") {
    try {
      const user = await UserModel.findByIdAndUpdate(userId, normalizedUser, {
        new: true,
        runValidators: true,
      }).select("-password -__v");
      if (!user) throw new Error("Could not find user with the given ID");
      return Promise.resolve(user);
    } catch (error) {
      error.status = 401;
      return handleBadRequest("Mongoose", error);
    }
  }
  return Promise.resolve("update user not in mongodb");
};

// Function to toggle the isBiz status of a user
const changeIsBizStatus = async (userId) => {
  if (DB === "MONGODB") {
    try {
      let user = await UserModel.findById(userId);
      if (!user) throw new Error("Could not find user with the given ID");

      user.isBusiness = !user.isBusiness;
      user = await user.save();

      user = lodash.pick(user, ["email", "_id", "isBusiness"]);
      return Promise.resolve(user);
    } catch (error) {
      error.status = 401;
      return handleBadRequest("Mongoose", error);
    }
  }
  return Promise.resolve("changeIsBizStatus user not in mongodb");
};

// Function to remove a user by ID
const remove = async (userId) => {
  if (DB === "MONGODB") {
    try {
      const user = await UserModel.findByIdAndDelete(userId).select(
        "-password -isAdmin"
      );
      if (!user) throw new Error("Could not find user with the given ID");
      return Promise.resolve(user);
    } catch (error) {
      error.status = 401;
      return handleBadRequest("Mongoose", error);
    }
  }
  return Promise.resolve("remove user not in mongodb");
};

module.exports = {
  register,
  login,
  find,
  findOne,
  update,
  changeIsBizStatus,
  remove,
};
