const ClothingItem = require("../models/clothingItem");
const { handleError, NOT_FOUND, FORBIDDEN } = require("../utils/errors");

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
    .orFail()
    .then((item) => res.send(item))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
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
    .orFail()
    .then((item) => res.send(item))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      return handleError(res, err);
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (item.owner.toString() !== req.user._id.toString()) {
        return res.status(FORBIDDEN).send({ message: "Forbidden" });
      }
      return ClothingItem.findByIdAndDelete(itemId).then((deletedItem) =>
        res.send(deletedItem)
      );
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      return handleError(res, err);
    });
};

module.exports = { getItems, createItem, likeItem, unlikeItem, deleteItem };
