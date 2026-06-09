const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { NOT_FOUND, handleError } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

// GET /users — returns all users
const getUsers = (req, res) => {
  User.find()
    .then((users) => res.send(users))
    .catch((err) => handleError(res, err));
};

// GET /users/:userId — returns a single user by _id, change the route to /users/me and return the current user based on the JWT payload
const getCurrentUser = (req, res) => {
  const userId = req.user._id || req.user.userId;
  User.findById(userId)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      return handleError(res, err);
    });
};

// POST /users — creates a new user
const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  if (!name || !avatar || !email || !password) {
    return res.status(400).send({ message: "All fields are required" });
  }

  return User.findOne({ email })
    .then((existing) => {
      if (existing) {
        const error = new Error("Email already exists");
        error.status = 409;
        throw error;
      }

      return bcrypt
        .hash(password, 10)
        .then((hashedPassword) =>
          User.create({ name, avatar, email, password: hashedPassword })
        );
    })
    .then((user) => {
      const createdUser = user.toObject();
      delete createdUser.password;
      return res.status(201).send(createdUser);
    })
    .catch((err) => {
      if (err && err.status) {
        return res.status(err.status).send({ message: err.message });
      }
      if (err.code === 11000) {
        return res.status(409).send({ message: "Email already exists" });
      }
      return handleError(res, err);
    });
};

// POST /signin — logs in a user and returns a JWT
const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ message: "Email and password are required" });
  }
  User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("Unauthorized"));
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error("Unauthorized"));
        }
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: "7d",
        });
        res.cookie("jwt", token, {
          httpOnly: true,
          sameSite: true,
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        return res.send({ token });
      });
    })
    .catch(() =>
      res.status(401).send({ message: "Invalid email or password" })
    );
};

// PATCH /users/me — updates the current user's profile
const updateUser = (req, res) => {
  const userId = req.user._id || req.user.userId;
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      return handleError(res, err);
    });
};

module.exports = { getUsers, getCurrentUser, createUser, login, updateUser };
