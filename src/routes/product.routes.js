import express from "express";
import {
  createProduct,
  deleteProducts,
  getAllProducts,
  getProducts,
  updateProducts,
} from "../controllers/product.controllers.js";
const router = express.Router();

router.route("/product/new").post(createProduct);
router.route("/products").get(getAllProducts);
router.route("/product/:id").put(updateProducts);
router.route("/product/:id").delete(deleteProducts);
router.route("/product/:id").get(getProducts);

export default router;
