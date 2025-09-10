// src/helpers/generate-biz-number.js

const { findByBizNumber } = require("../dal/card.dal");
const lodash = require("lodash");
const { handleBadRequest } = require("../utils/error-handler");

const generateBizNumber = async () => {
  try {
    const randomNumber = lodash.random(1_000_000, 9_999_999);
    const card = await findByBizNumber(randomNumber);
    if (card) {
      return generateBizNumber();
    }
    return randomNumber;
  } catch (error) {
    return handleBadRequest("Generate BizNumber", error);
  }
};

module.exports = generateBizNumber;
