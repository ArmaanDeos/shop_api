import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiFeatures } from "../utils/features/ApiFeatures.js";
import { generateAccessToken } from "../utils/jwt/jwt.js";

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

export { registerUser, loginUser };
