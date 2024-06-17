const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

const createAccount = async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName) {
    return res.status(400).json({ error: "Full name is required" });
  }
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }
  if (!password) {
    return res.status(400).json({ error: "Password is required" });
  }

  const isUser = await User.findOne({ email });

  if (isUser) {
    return res.json({
      error: true,
      message: "User already exists",
    });
  }

  const user = new User({
    fullName,
    email,
    password,
  });

  await user.save();

  const accessToken = jwt.sign(
    { user: user._id },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "36000m",
    }
  );

  return res.json({
    error: false,
    user,
    accessToken,
    message: "Registration Successful",
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  const userInfo = await User.findOne({ email });

  if (!userInfo) {
    return res.status(404).json({ message: "User not found" });
  }

  if (userInfo.email === email && userInfo.password === password) {
    const accessToken = jwt.sign(
      { user: userInfo._id },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "36000m",
      }
    );

    return res.json({
      error: false,
      message: "Login successful",
      email,
      accessToken,
    });
  } else {
    return res.status(400).json({
      error: true,
      message: "Invalid Credentials",
    });
  }
};

const getUser = async (req, res) => {
  const { user } = req; // Lấy thông tin người dùng từ req.user

  try {
    const isUser = await User.findOne({ _id: user._id });

    if (!isUser) {
      return res.sendStatus(401);
    }

    return res.json({
      user: {
        fullName: isUser.fullName,
        email: isUser.email,
        _id: isUser._id,
        CreatedOn: isUser.CreatedOn,
      },
      message: "User found",
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  createAccount,
  login,
  getUser,
};
