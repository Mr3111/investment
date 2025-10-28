const userModel = require("../models/userModel.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validator = require("validator");
const { HTTP_STATUS } = require("../config/constants.js");

// login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ success: false, message: "User does not exist" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ success: false, message: "Invalid credentials" });
  }

  const token = createToken(user._id);
  res.json({ success: true, token });
};

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// register user
const registerUser = async (req, res) => {
  const { name, password, email } = req.body;
  // checking if user already exists
  const exists = await userModel.findOne({ email });
  if (exists) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ success: false, message: "User already exists" });
  }

  // validating email format and password
  if (!validator.isEmail(email)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: "Please enter a valid email" });
  }

  if (password.length < 8) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: "Please enter a strong password" });
  }

  // hashing user password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new userModel({
    name: name,
    email: email,
    password: hashedPassword,
  });

  const user = await newUser.save();
  const token = createToken(user._id);
  res.json({ success: true, token });
};

module.exports = { loginUser, registerUser };
