const express = require("express");
const { loginUser, registerUser } = require("../controllers/userController.js");
const asyncHandler = require("../middleware/asyncHandler.js");

const userRouter = express.Router();

userRouter.post("/register", asyncHandler(registerUser));
userRouter.post("/login", asyncHandler(loginUser));

module.exports = userRouter;