const bcrypt = require("bcrypt");
const validator = require("validator");
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      validate: [validator.isEmail, "Email not valid"],
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      validate: [validator.isStrongPassword],
    },
    rol: {
      type: String,
      enum: ["admin", "user", "superadmin"],
      default: "user",
    },
    image: {
      type: String,
    },
    wallet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Wallet'
    },
    library: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book'
    }],
    favorites: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book'
    }]
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  if (this.isModified('password')) {
    try {
      this.password = await bcrypt.hash(this.password, 10);
      next();
    } catch (error) {
      next("Error hashing password", error);
    }
  } else {
    next();
  }
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
