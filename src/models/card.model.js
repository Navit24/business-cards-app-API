const mongoose = require("mongoose");
const Address = require("./address.schema");
const Image = require("./image.schema");
const { DEFAULT_VALIDATION, URL } = require("../helpers/mongoose-validators");

const Card = new mongoose.Schema({
  title: DEFAULT_VALIDATION,
  subtitle: DEFAULT_VALIDATION,
  description: {
    ...DEFAULT_VALIDATION,
    maxLength: 1024,
  },
  phone: {
    type: String,
    required: true,
    match: RegExp(/0[0-9]{1,2}\-?\s?[0-9]{3}\s?[0-9]{4}/),
  },
  email: {
    type: String,
    required: true,
    match: RegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
    lowercase: true,
    trim: true,
    unique: true,
  },
  web: URL,
  image: Image,
  address: Address,
  bizNumber: {
    type: Number,
    minlength: 1,
    maxlength: 9,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  likes: {
    type: [String],
  },
});

Card.index({ user_id: 1 });
Card.index({ likes: 1 });
Card.index({ createdAt: -1 });

const CardModel = mongoose.model("Card", Card);
module.exports = CardModel;
