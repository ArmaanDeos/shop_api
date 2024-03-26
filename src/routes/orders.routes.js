import express from "express";
import {
  isAuthenticatedUser,
  isAuthorizedRoles,
} from "../middlewares/auth.middlewares.js";
import {
  createNewOrder,
  deleteOrder,
  getAllOrders,
  getSingleOrder,
  getUserOrders,
  updateOrderStatus,
} from "../controllers/orders.controllers.js";
const router = express.Router();

// Note : CREATE ORDER || POST
router.route("/order/new").post(isAuthenticatedUser, createNewOrder);

// Note : GET SINGLE ORDER -- ADMIN || GET
router
  .route("/order/:id")
  .get(isAuthenticatedUser, isAuthorizedRoles("admin"), getSingleOrder);

// Note : GET USER ORDERS || GET
router.route("/orders/me").get(isAuthenticatedUser, getUserOrders);

// Note : GET ALL ORDERS -- ADMIN || GET
router
  .route("/admin/orders")
  .get(isAuthenticatedUser, isAuthorizedRoles("admin"), getAllOrders);

// Note : UPDATE ORDER STATUS -- ADMIN || PUT
router
  .route("/admin/orders/:id")
  .put(isAuthenticatedUser, isAuthorizedRoles("admin"), updateOrderStatus);

// Note : DELETE ORDER -- ADMIN || DELETE
router
  .route("/admin/orders/:id")
  .delete(isAuthenticatedUser, isAuthorizedRoles("admin"), deleteOrder);

export default router;
