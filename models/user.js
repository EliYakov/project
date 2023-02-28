const Joi = require("joi");
const jwt = require("jsonwebtoken");

const mongoose = require("mongoose");
const { JWTSecretToken } = require("../configs/config");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 255,
  },

  email: {
    type: String,
    required: true,
    minLength: 6,
    maxLength: 255,
    unique: true,
  },

  password: {
    type: String,
    required: true,
    minLength: 6,
    maxLength: 1024,
  },

  biz: {
    type: Boolean,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

UserSchema.methods.generateAuthToken = function () {
  return jwt.sign({ _id: this._id, biz: this._id }, JWTSecretToken);
};

const User = mongoose.model("User", UserSchema, "users");

const validateUser = (user) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(255).required(),
    email: Joi.string().min(6).max(255).email().required(),
    password: Joi.string().min(6).max(1024).required(),
    biz: Joi.boolean().required(),
  });

  return schema.validate(user);
};

module.exports = {
  User,
  validateUser,
};
