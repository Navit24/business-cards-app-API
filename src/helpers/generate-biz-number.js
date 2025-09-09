const CardModel = require("../models/card.model");
const lodash = require("lodash");
const { handleBadRequest } = require("../utils/error-handler");

const generateBizNumber = async () => {
  try {
    const randomNumber = lodash.random(1_000_000, 9_999_999);
    const card = await CardModel.findOne(
      { bizNumber: randomNumber },
      { bizNumber: 1, _id: 0 }
    );
    if (card) {
      return generateBizNumber();
    }
    return randomNumber;
  } catch (error) {
    return handleBadRequest("Generate BizNumber", error);
  }
};

module.exports = generateBizNumber;
