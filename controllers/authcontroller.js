const User = require("../models/User");
const user = require("../models/User");
const generateToken = require("../utils/generateToken");

// Register new user controller

exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
};
