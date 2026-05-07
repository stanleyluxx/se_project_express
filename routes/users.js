const router = require("express").Router();
const { getUsers, getUser, createUser } = require("../controllers/users");
const { NOT_FOUND } = require("../utils/errors");

router.get("/", getUsers);
router.get("/:userId", getUser);
router.post("/", createUser);

router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});

module.exports = router;