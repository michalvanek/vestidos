const { constants } = require("../constants");
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;
  if (statusCode === constants.VALIDATION_ERROR) {
    res.json({
      title: "Validation failed",
      message: err.message,
      stackTrace: err.stack,
    });
  } else if (statusCode === constants.NOT_FOUND) {
    res.json({
      title: "Not found",
      message: err.message,
      stackTrace: err.stack,
    });
  } else if (statusCode === constants.UNAUTHORIZED) {
    res.json({
      title: "Unauthorized",
      message: err.message,
      stackTrace: err.stack,
    });
  } else if (statusCode === constants.FORBIDDEN) {
    res.json({
      title: "Forbidden",
      message: err.message,
      stackTrace: err.stack,
    });
  } else if (statusCode === constants.SERVER_ERROR) {
    res.json({
      title: "Server error",
      message: err.message,
      stackTrace: err.stack,
    });
  } else {
    console.log("No error, everything OK!");
  }
};
module.exports = errorHandler;
