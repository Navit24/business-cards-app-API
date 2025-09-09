// src/models/name.schema.js

const mongoose = require("mongoose");
const { DEFAULT_VALIDATION } = require("../helpers/mongoose-validators");

// Schema for user's name with first, middle, and last fields
const Name = new mongoose.Schema({
  first: DEFAULT_VALIDATION,
  middle: {
    type: String,
    trim: true,
    lowercase: true,
    maxlength: 256,
  },
  last: DEFAULT_VALIDATION,
});

module.exports = Name;
