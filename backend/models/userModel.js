let mongoose = require("mongoose"),
  { Schema } = mongoose,
  Joi = require("joi"),
  bcrypt = require("bcrypt");

const userSchema = new Schema(
  {
    userName: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.methods.validateUserFields = (user) => {
  const joiUserSchema = Joi.object({
    _id: Joi.options({ allowUnknown: true }),
    isAdmin: Joi.options({ allowUnknown: true }),
    userName: Joi.string().alphanum().min(2).max(30).required(),
    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),
    password: Joi.string().required().pattern(new RegExp(`[a-zA-Z0-9]{9}`)),
    createdAt: Joi.options({ allowUnknown: true }),
    updatedAt: Joi.options({ allowUnknown: true }),
    __v: Joi.options({ allowUnknown: true }),
  });
  return joiUserSchema.validate(user);
};

userSchema.methods.hashUserPassword = (psw) => {
  const saltRounds = 5;
  const salt = bcrypt.genSaltSync(saltRounds);
  return bcrypt.hashSync(psw, salt);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
