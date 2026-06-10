const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { UNAUTHORIZED } = require("../utils/errors");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  let token = null;

  if (authorization && authorization.startsWith("Bearer ")) {
    token = authorization.replace("Bearer ", "");
  }

  // If token wasn't provided in Authorization header, try to read it from cookies
  if (!token && req.headers.cookie) {
    const cookies = req.headers.cookie.split("; ");
    const jwtCookie = cookies.find((c) => c.startsWith("jwt="));
    if (jwtCookie) token = jwtCookie.replace("jwt=", "");
  }

  if (!token) {
    return res.status(UNAUTHORIZED).send({ message: "Authorization Required" });
  }

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(UNAUTHORIZED).send({ message: "Authorization Required" });
  }

  req.user = payload;

  return next();
};
