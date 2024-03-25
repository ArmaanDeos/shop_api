import express from "express";
import {
  createProduct,
  createProductReviewAndUpdateReview,
  deleteProductReviews,
  deleteProducts,
  getAllProducts,
  getProductReviews,
  getProducts,
  updateProducts,
} from "../controllers/product.controllers.js";
import {
  isAuthenticatedUser,
  isAuthorizedRoles,
} from "../middlewares/auth.middlewares.js";
const router = express.Router();

// Note : GET ALL PRODUCTS || GET
router.route("/products").get(getAllProducts);

// Note : CREATE PRODUCT || POST
router
  .route("/admin/product/new")
  .post(isAuthenticatedUser, isAuthorizedRoles("admin"), createProduct);

// Note : UPDATE PRODUCT || PUT
router
  .route("admin/product/:id")
  .put(isAuthenticatedUser, isAuthorizedRoles("admin"), updateProducts);

// Note : DELETE PRODUCT || DELETE
router
  .route("/admin/product/:id")
  .delete(isAuthenticatedUser, isAuthorizedRoles("admin"), deleteProducts);

// Note : GET SINGLE PRODUCT || GET
router.route("/product/:id").get(getProducts);

// Note : CREATE PRODUCT REVIEW || PUT
router
  .route("/review")
  .put(isAuthenticatedUser, createProductReviewAndUpdateReview);

// Note : GET ALL PRODUCT REVIEWS || GET
router.route("/reviews").get(getProductReviews);

// Note : DELETE PRODUCT REVIEW || DELETE
router.route("/reviews").delete(deleteProductReviews);

export default router;
