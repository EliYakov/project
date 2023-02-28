const express = require("express");
const router = express.Router();

const authMW = require("../middleware/auth");
const {
  Card,
  validateCard,
  generateBusinessNumber,
} = require("../models/card");

router.delete("/:id", authMW, async (req, res) => {
  const card = await Card.findByIdAndRemove({
    _id: req.params.id,
    user_id: req.user._id,
  });

  if (!card) {
    res.status(404).send("card wanst found and cannot be deleted");
    return;
  }
  res.send(card);
});

router.put("/:id", authMW, async (req, res) => {
  const { error } = validateCard(req.body);

  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  const changeCard = await Card.findByIdAndUpdate(
    {
      _id: req.params.id,
      user_id: req.user._id,
    },
    req.body,
    { new: true }
  );
  res.send(changeCard);
});

router.get("/all-cards", authMW, async (req, res) => {
  const cards = await Card.find({
    user_id: req.user._id,
  });

  if (!cards) {
    res.status(404).send("There are no cards in archive");
    return;
  }
  res.send(cards);
});

router.get("/:id", authMW, async (req, res) => {
  const card = await Card.findById({
    _id: req.params.id,
    user_id: req.user._id,
  });

  if (!card) {
    res.status(404).send("card wasnt found");
  }
  res.send(card);
});

router.post("/create-card", authMW, async (req, res) => {
  // validate user input
  const { error } = validateCard(req.body);

  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  // validate system requirements
  // process
  const card = await new Card({
    ...req.body,
    bizImage:
      req.body.bizImage ||
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",

    bizNumber: await generateBusinessNumber(),
    user_id: req.user._id,
  }).save();
  // response

  res.send(card);
});

module.exports = router;
