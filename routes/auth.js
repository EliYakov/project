const express = require("express");
const Joi = require("joi");
const router = express.Router();
const bcrypt = require("bcrypt");

const { User } = require("../models/user");


// router.get("/", (req, res) => {
//   res.send("hello");
// });

router.post("/", async (req, res) => {
  /// validate user input

  const { error } = validate(req.body);

  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  /// validate system requirements
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    res.status(400).send("invalid email");
    return;
  }

  const isValidPassword = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!isValidPassword) {
    res.status(400).send("inValid Password");
    return;
  }
  /// process
  const token = user.generateAuthToken();
  /// response
  res.send({ token });
});

function validate(user) {
  const schema = Joi.object({
    email: Joi.string().min(6).max(255).email().required(),
    password: Joi.string().min(6).max(1024).required(),
  });

  return schema.validate(user);
}

module.exports = router;
