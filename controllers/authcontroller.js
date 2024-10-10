const User = require("../models/User");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const generateToken = require("../utils/generateToken");

// Set up test nodemailer transporter using Ethereal
const createTestTransporter = async () => {
  const testAccount = await nodemailer.createTestAccount();

  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    // true for 465, false for other ports
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
};

// Register new user controller

exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please fill out all inputs" });
  }
  try {
    const userExists = await User.findOne({ email });

    if (userExists)
      return res.status(400).json({ message: "User already exists" });

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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// login controller

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Forgot password controller
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const transporter = await createTestTransporter(); // Use test transporter

    const mailOptions = {
      to: user.email,
      subject: "Password Reset",
      text:
        `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n` +
        `Please click on the following link to reset your password:\n` +
        `http://localhost:3000/reset-password/${resetToken}\n\n` +
        `If you did not request this, please ignore this email.\n`,
    };

    const info = await transporter.sendMail(mailOptions);

    // Log preview URL to console
    console.log("Preview Forgot Password URL: %s", nodemailer.getTestMessageUrl(info));

    res.json({ message: "Email sent with password reset link" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
