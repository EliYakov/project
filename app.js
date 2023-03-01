require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const morgan = require("morgan");

const userRouter = require("./routes/user");
const authRouter = require("./routes/auth");
const cardRouter = require("./routes/card");

const app = express();

app.use(morgan("dev"));
app.use(express.json());

mongoose.set("strictQuery", false);
mongoose
  .connect("mongodb://127.0.0.1:27017/PROJECT")
  .then(() => console.log("connected to mongoDB"))
  .catch((err) => console.log("could not connect mongoDB", err));



app.use("/user", userRouter);
app.use("/auth", authRouter);
app.use("/card", cardRouter);

const PORT = 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
