const ClothingItem = require("../models/clothingItem");
const { handleError } = require("../utils/errors");
const { NOT_FOUND } = require("../utils/errors");

const getItems = (req, res) => {
  ClothingItem.find()
    .then((items) => res.send(items))
    .catch((err) => handleError(res, err));
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.status(201).send(item))
    .catch((err) => handleError(res, err));
};

const likeItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      const error = new Error("Item not found");
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((item) => res.send(item))
    .catch((err) => {
      if (err.statusCode === NOT_FOUND) {
        return res.status(404).send({ message: err.message });
      }
      return handleError(res, err);
    });
};

const unlikeItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      const error = new Error("Item not found");
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((item) => res.send(item))
    .catch((err) => {
      if (err.statusCode === NOT_FOUND) {
        return res.status(404).send({ message: err.message });
      }
      return handleError(res, err);
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndDelete(itemId)
    .orFail(() => {
      const error = new Error("Item not found");
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then(() => res.send({ message: "Item deleted successfully" }))
    .catch((err) => {
      if (err.statusCode === NOT_FOUND) {
        return res.status(404).send({ message: err.message });
      }
      return handleError(res, err);
    });
};

module.exports = { getItems, createItem, likeItem, unlikeItem, deleteItem };
