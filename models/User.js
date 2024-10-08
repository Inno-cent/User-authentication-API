const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// hashing password before saving ti database using bcrypt

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();
});
