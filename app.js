const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./routes/users");
const clothingItemRouter = require("./routes/clothingItems");
const { NOT_FOUND } = require("./utils/errors");

const { PORT = 3001 } = process.env;

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: "69f3b92a203e85ff2d5b5f17",
  };
  next();
});

app.use("/users", userRouter);
app.use("/items", clothingItemRouter);

app.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
console.error(err);
  });

app.listen(PORT);
