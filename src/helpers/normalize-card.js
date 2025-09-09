// src/helpers/normalize-card.js

const generateBizNumber = require("./generate-biz-number");

const normalizCard = async (rawCard, userId) => {
  const { url, alt } = rawCard.image;
  const image = {
    url:
      url ||
      "https://cdn.pixabay.com/photo/2016/04/20/08/21/entrepreneur-1340649_960_720.jpg",
    alt: alt || "Business card image",
  };
  return {
    ...rawCard,
    image,
    address: {
      ...rawCard.address,
      state: rawCard.address.state || "not defined",
    },
    bizNumber: rawCard.bizNumber || (await generateBizNumber()),
    user_id: rawCard.userId || userId,
  };
};

module.exports = normalizCard;
