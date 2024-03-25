import express from "express";
import {
  forgetPassword,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
} from "../controllers/user.controllers.js";
const router = express.Router();

// Note : REGISTER USER ROUTE || POST
router.route("/register").post(registerUser);

// Note : LOGIN USER ROUTE || POST
router.route("/login").post(loginUser);

// Note : FORGET PASSWORD USER ROUTE || POST
router.route("/password/forget").post(forgetPassword);

// Note : RESET PASSWORD USER ROUTE || PUT
router.route("/password/reset/:token").put(resetPassword);

// Note : LOGOUT USER ROUTE || GET
router.route("/logout").get(logoutUser);

export default router;
