import express from "express";
import {
  changeUserPassword,
  forgetPassword,
  getAllUsers,
  getCurrentUserDetails,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  getSingleUser,
  updateUserDetails,
  updateUserRole,
  deleteUser,
} from "../controllers/user.controllers.js";
import {
  isAuthenticatedUser,
  isAuthorizedRoles,
} from "../middlewares/auth.middlewares.js";
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

// Note :  USER DETAILS ROUTE || GET
router.route("/me").get(isAuthenticatedUser, getCurrentUserDetails);

// Note: CHANGE USER PASSWORD ROUTE || PUT
router.route("/password/update").put(isAuthenticatedUser, changeUserPassword);

// Note : UPDATE USER PROFILE ROUTE || PUT
router.route("/me/update").put(isAuthenticatedUser, updateUserDetails);

// Note : GET ALL USERS || GET
router
  .route("/admin/users")
  .get(isAuthenticatedUser, isAuthorizedRoles("admin"), getAllUsers);

// Note : GET SINGLE USER || GET
router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, isAuthorizedRoles("admin"), getSingleUser);

// Note : UPDATE USER ROLE || PUT
router
  .route("/admin/user/:id")
  .put(isAuthenticatedUser, isAuthorizedRoles("admin"), updateUserRole);

// Note : DELETE USER || DELETE
router
  .route("/admin/user/:id")
  .delete(isAuthenticatedUser, isAuthorizedRoles("admin"), deleteUser);

export default router;
