import express from "express";
import {
  createProduct,
  deleteProducts,
  getAllProducts,
  getProducts,
  updateProducts,
} from "../controllers/product.controllers.js";
import {
  isAuthenticatedUser,
  isAuthorizedRoles,
} from "../middlewares/auth.middlewares.js";
const router = express.Router();

router.route("/products").get(getAllProducts);
router
  .route("/product/new")
  .post(isAuthenticatedUser, isAuthorizedRoles("admin"), createProduct);
router
  .route("/product/:id")
  .put(isAuthenticatedUser, isAuthorizedRoles("admin"), updateProducts);
router
  .route("/product/:id")
  .delete(isAuthenticatedUser, isAuthorizedRoles("admin"), deleteProducts);
router.route("/product/:id").get(getProducts);

export default router;
