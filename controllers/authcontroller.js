const User = require("../models/User");
const user = require("../models/User");
const generateToken = require("../utils/generateToken");

// Register new user controller

exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists)
    return res.status(400).json({ message: "User already exists" });

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please fill out all inputs" });
  }

  const user = await User.create({ name, email, password });
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = User.findOne({ email });

  if (user && (await user.matchedPassword({ password }))) {
    res.json({
      _id: user._id,
    });
  }
};
