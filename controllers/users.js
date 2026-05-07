const User = require("../models/user");
const { NOT_FOUND, handleError } = require("../utils/errors");

// GET /users — returns all users
const getUsers = (req, res) => {
  User.find()
    .then((users) => res.send(users))
    .catch((err) => handleError(res, err));
};

// GET /users/:userId — returns a single user by _id
const getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      return res.send(user);
    })
    .catch((err) => handleError(res, err));
};

// POST /users — creates a new user
const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => handleError(res, err));
};

module.exports = { getUsers, getUser, createUser };
