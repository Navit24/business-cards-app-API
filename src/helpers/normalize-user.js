// src/helpers/normalize-user.js

// Normalize user object by ensuring default values for missing fields
const normalizedUser = (rawUser) => {
  const safeUser = { ...rawUser };
  const safeName = { ...(safeUser.name || {}) };
  const safeImage = { ...(safeUser.image || {}) };
  const safeAddress = { ...(safeUser.address || {}) };

  const name = { ...safeName, middle: safeName.middle || "" };

  const image = {
    ...safeImage,
    url:
      safeImage.url ||
      "https://cdn.pixabay.com/photo/2016/04/01/10/11/avatar-1299805_960_720.png",
    alt: safeImage.alt || "Business card image",
  };

  const address = {
    ...safeAddress,
    state: safeAddress.state || "not defined",
  };

  const user = {
    ...safeUser,
    name,
    image,
    address,
  };

  return user;
};

module.exports = normalizedUser;
