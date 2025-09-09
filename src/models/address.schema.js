const mongoose = require("mongoose");
const { DEFAULT_VALIDATION } = require("../helpers/mongoose-validators");

const Address = new mongoose.Schema({
  state: {
    type: String,
    maxLength: 256,
    trim: true,
    lowercase: true,
  },
  country: DEFAULT_VALIDATION,
  city: DEFAULT_VALIDATION,
  street: DEFAULT_VALIDATION,
  houseNumber: {
    type: Number,
    required: true,
    minlength: 1,
    trim: true,
  },
  zip: {
    type: Number,
    minlength: 4,
    default: 0,
    trim: true,
  },
});

module.exports = Address;
