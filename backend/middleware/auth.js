const jwt = require("jsonwebtoken");
const { HTTP_STATUS } = require("../config/constants.js");

const authMiddleware = async (req, res, next) => {
  const { token } = req.headers;
  if (!token) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ success: false, message: "Not Authorized, login again" });
  }

  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    req.body.userId = token_decode.id;
    next();
  } catch (error) {
    console.log(error);
    res.status(HTTP_STATUS.UNAUTHORIZED).json({ success: false, message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
