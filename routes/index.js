const router = require("express").Router();
const User = require("./users");

router.use("/users", userRouter);

module.exports = router;