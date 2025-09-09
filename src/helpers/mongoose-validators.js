// src/helpers/mongoose-validators.js

// Mongoose validators for URL and default string fields
const URL = {
  type: String,
  match: RegExp(
    /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/
  ),
  trim: true,
  lowercase: true,
};

// Default validation for string fields
const DEFAULT_VALIDATION = {
  type: String,
  required: true,
  minlength: 2,
  maxlength: 256,
  trim: true,
  lowercase: true,
};

module.exports = { URL, DEFAULT_VALIDATION };
