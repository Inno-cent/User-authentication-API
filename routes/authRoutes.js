const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  forgotPassword,
} = require("../controllers/authcontroller");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forget-password", forgotPassword);

module.exports = router;
