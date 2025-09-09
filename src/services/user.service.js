// src/services/user.service.js

const {
  register,
  login,
  find,
  findOne,
  update,
  changeIsBizStatus,
  remove,
} = require("../dal/user.dal");
const {
  validateRegisteration,
  validateLogin,
  validateUserUpdate,
} = require("../validation/validators");
const normalizedUser = require("../helpers/normalize-user");
const { generateUserPassword } = require("../helpers/hash-password");

// Service function to register a new user
const registerUser = async (rawUser) => {
  try {
    const { error } = validateRegisteration(rawUser);
    if (error) {
      return Promise.reject(error);
    }
    let user = normalizedUser(rawUser);
    user.password = generateUserPassword(user.password);
    user = await register(user);
    return Promise.resolve(user);
  } catch (error) {
    return Promise.reject(error);
  }
};

// Service function to login a user
const loginUser = async (rawUser) => {
  try {
    const { error } = validateLogin(rawUser);
    if (error) {
      return Promise.reject(error);
    }
    let user = { ...rawUser };
    user = await login(user);
    return Promise.resolve(user);
  } catch (error) {
    return Promise.reject(error);
  }
};

// Service functions to interact with the user data access layer
const getUsers = async () => {
  try {
    const users = await find();
    return Promise.resolve(users);
  } catch (error) {
    return Promise.reject(error);
  }
};

// Service function to get a specific user by ID
const getUserById = async (userId) => {
  try {
    const user = await findOne(userId);
    return Promise.resolve(user);
  } catch (error) {
    return Promise.reject(error);
  }
};

// Service function to update a user by ID
const updateUser = async (userId, rawUser) => {
  try {
    const { error } = validateUserUpdate(rawUser);
    if (error) {
      return Promise.reject(error);
    }
    const { password, isAdmin, _id, __v, createdAt, ...rest } = rawUser;
    const userPayload = normalizedUser(rest);
    const user = await update(userId, userPayload);
    return Promise.resolve(user);
  } catch (error) {
    return Promise.reject(error);
  }
};

// Service function to change a user's business status
const changeUserIsBizStatus = async (userId, isBiz) => {
  try {
    const user = await changeIsBizStatus(userId, isBiz);
    return Promise.resolve(user);
  } catch (error) {
    return Promise.reject(error);
  }
};

// Service function to delete a user by ID
const deleteUser = async (userId) => {
  try {
    const user = await remove(userId);
    return Promise.resolve(user);
  } catch (error) {
    return Promise.reject(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUsers,
  getUserById,
  updateUser,
  changeUserIsBizStatus,
  deleteUser,
};
