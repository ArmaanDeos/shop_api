import mongoose, { Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
      maxLength: [30, "Name cannot exceed 30 characters"],
      minLength: [5, "Name should have more than 5 characters"],
    },
    email: {
      type: String,
      required: [true, "Please enter email address"],
      unique: true,
      validate: [validator.isEmail, "Please enter valid email address"],
    },
    password: {
      type: String,
      required: [true, "Please enter password"],
      minLength: [8, "Password should be greater than 8 characters"],
    },

    avatar: {
      public_id: {
        type: String,
        requreid: true,
      },
      url: {
        type: String,
        requreid: true,
      },
    },
    role: {
      type: String,
      default: "user",
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

// Encrypt Password before save
userSchema.pre("save", async function (next) {
  // if password is not modified
  if (!this.isModified("password")) return next();

  // if there any modification inside password field so encrypt it.
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Methods for check user password is correct and decrypt. --
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Methods for generate access token --
userSchema.methods.getAccessToken = function () {
  return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES,
  });
};

export const User = mongoose.model("User", userSchema);
