const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const INTERNAL_SERVER_ERROR = 500;

const DEFAULT_ERROR_MESSAGE = "Internal Server Error";

const handleError = (res, err) => {
  if (err.name === "ValidationError" || err.name === "CastError") {
    return res.status(BAD_REQUEST).send({ message: err.message });
  }

  return res
    .status(INTERNAL_SERVER_ERROR)
    .send({ message: DEFAULT_ERROR_MESSAGE });
};

module.exports = {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  DEFAULT_ERROR_MESSAGE,
  handleError,
};
