const { HTTP_STATUS } = require("../config/constants.js");

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  console.error(err);
  if (res.headersSent) {
    return;
  }
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: "Internal server error" });
};

module.exports = errorHandler;


