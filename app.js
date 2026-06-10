const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRouter = require("./routes/users");
const clothingItemRouter = require("./routes/clothingItems");
const { login, createUser } = require("./controllers/users");
const { NOT_FOUND } = require("./utils/errors");
const auth = require("./middlewares/auth");

const { PORT = 3001 } = process.env;

const app = express();

app.use(cors());

app.use(express.json());

app.post("/signin", login);
app.post("/signup", createUser);

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
