import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiFeatures } from "../utils/features/ApiFeatures.js";
import { generateAccessToken } from "../utils/jwt/jwt.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";

// TODO : Register User
const registerUser = asyncHandler(async (req, res) => {
  // get user detaisl from req.body
  const { name, email, password } = req.body;

  // Validation -- all fields are required...
  if ([name, email, password].some((field) => field?.trim === "")) {
    throw new ApiError(
      400,
      "All Fields are required",
      "Error while creating user"
    );
  }

  // Check exists user or not --
  const existingUser = await User.findOne({ $or: [{ email }] });
  if (existingUser) {
    throw new ApiError(400, "User already exists", "Error while creating user");
  }

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "sample_id",
      url: "sample_url",
    },
  });

  // Generate access token--
  generateAccessToken(user, 201, res);
});

// TODO : Login User
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // validation
  if (!email || !password) {
    throw new ApiError(
      400,
      "All fields are required",
      "Error while login user"
    );
  }

  // Check user exists or not
  const user = await User.findOne({ $or: [{ email }, { password }] });
  if (!user) {
    throw new ApiError(401, "User not found", "Error while login user");
  }

  // Check password is correct or not
  const isValidPassword = await user.isPasswordCorrect(password);
  if (!isValidPassword) {
    throw new ApiError(
      401,
      "Invalid Email or Password",
      "Error while login user"
    );
  }

  // Generate access token
  generateAccessToken(user, 200, res);
});

//TODO : Logout User
const logoutUser = asyncHandler(async (req, res) => {
  // Set cookie with an expiration date in the past to clear it
  res.cookie("token", "", {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out Successfully",
  });
});

// TODO : FORGET PASSWORD
const forgetPassword = asyncHandler(async (req, res) => {
  // find user with email
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    throw new ApiError(404, "User not found", "Error while reseting password");

  // get resetPasswordToken
  const resetToken = user.getPasswordResetToken();
  // save user
  await user.save({ validateBeforeSave: false });

  // create url for reset password
  const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

  // message for mail
  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\n If you have not requested this email then, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "rymo shop Password Recovery",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    throw new ApiError(500, error.message, "Error while reseting password");
  }
});

// TODO : RESET PASSWORD
const resetPassword = asyncHandler(async (req, res) => {
  // create hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token) // passing reset token from url
    .digest("hex");

  // find user and pass reset token
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  // check for user
  if (!user)
    throw new ApiError(
      400,
      "Invalid token or Token has been expired",
      "Error while reseting password"
    );

  // check new password and confierm password same or not
  if (req.body.password !== req.body.confirmPassword) {
    throw new ApiError(
      400,
      "Password and confirm password are not same",
      "Error while reseting password"
    );
  }

  // if all ok then set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  // at last save the user
  await user.save();

  // Generate access token for login user
  generateAccessToken(user, 200, res);
});

export { registerUser, loginUser, logoutUser, forgetPassword, resetPassword };
