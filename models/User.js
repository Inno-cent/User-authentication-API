const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    password: { type: String, required: true },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },

  {
    timestamps: true,
  }
);

// hashing password before saving ti database using bcrypt

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// comparing password for logining

userSchema.methods.comparePassword = async function (enteredPassword) {
  console.log("Stored password:", this.password); // hashed password
  console.log("Entered password:", enteredPassword);
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
