const Joi = require("joi");

const userUpdateValidation = (user) => {
  const urlRegex =
    /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;

  const schema = Joi.object({
    name: Joi.object().keys({
      first: Joi.string().min(2).max(256),
      middle: Joi.string().min(2).max(256).allow(""),
      last: Joi.string().min(2).max(256),
    }),
    phone: Joi.string()
      .ruleset.regex(/0[0-9]{1,2}\-?\s?[0-9]{3}\s?[0-9]{4}/)
      .rule({ message: "Phone must be a valid Israeli phone number" }),
    email: Joi.string()
      .ruleset.regex(
        /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
      )
      .rule({ message: "Email must be a valid email address" }),
    password: Joi.forbidden(),
    isAdmin: Joi.forbidden(),
    isBusiness: Joi.boolean(),
    image: Joi.object({
      url: Joi.string()
        .ruleset.regex(urlRegex)
        .rule({ message: "image url must be a valid url" })
        .allow(""),
      alt: Joi.string().min(2).max(256).allow(""),
    }),
    address: Joi.object().keys({
      state: Joi.string().min(2).max(256).allow(""),
      country: Joi.string().min(2).max(256),
      city: Joi.string().min(2).max(256),
      street: Joi.string().min(2).max(256),
      houseNumber: Joi.number().greater(0),
      zip: Joi.number().min(1000).allow(0),
    }),
  });

  return schema.validate(user);
};

module.exports = userUpdateValidation;
