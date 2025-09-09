const mongoose = require("mongoose");
const { DEFAULT_VALIDATION, URL } = require("../helpers/mongoose-validators");

const Image = new mongoose.Schema({
  url: URL,
  alt: DEFAULT_VALIDATION,
});

module.exports = Image;
