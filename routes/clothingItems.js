const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  getItems,
  createItem,
  likeItem,
  unlikeItem,
  deleteItem,
} = require("../controllers/clothingItems");
const { NOT_FOUND } = require("../utils/errors");

router.get("/", getItems);
router.use(auth);
router.post("/", createItem);
router.put("/:itemId/likes", likeItem);
router.delete("/:itemId/likes", unlikeItem);
router.delete("/:itemId", deleteItem);

router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});

module.exports = router;
