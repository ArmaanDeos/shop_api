import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import jwt from "jsonwebtoken";

const isAuthenticatedUser = asyncHandler(async (req, res, next) => {
  const { token } = req.cookies;
  //   console.log(token);

  if (!token) {
    throw new ApiError(
      401,
      "Please login to access this resource",
      "Error while authenticating user"
    );
  }
  const decodedData = jwt.verify(
    String(token),
    process.env.ACCESS_TOKEN_SECRET
  );
  req.user = await User.findById(decodedData.id);
  next();
});

const isAuthorizedRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ApiError(
        403,
        "You are not authorized to access this resource",
        "Error while authorizing user"
      );
    }
    next();
  };
};

export { isAuthenticatedUser, isAuthorizedRoles };
