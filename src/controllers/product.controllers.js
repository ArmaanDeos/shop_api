import { Product } from "../models/product.models.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

// Create Products -- Admin
const createProduct = asyncHandler(async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res
      .status(201)
      .json(new ApiResponse(201, newProduct, "Product Created Successfully"));
  } catch (error) {
    console.log("Error while creating product", error);
    res
      .status(500)
      .json(new ApiError(500, null, "Error while creating product"));
  }
});

// Get Products
const getProducts = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json(new ApiError(404, null, "Product Not Found"));
    }
    res.status(200).json(new ApiResponse(200, product, "Product Found"));
  } catch (error) {
    res
      .status(500)
      .json(new ApiError(500, null, "Error while fetching product"));
  }
});

// Get All Products
const getAllProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find();
    res
      .status(200)
      .json(new ApiResponse(200, products, "Products fetched Successfully"));
  } catch (error) {
    res
      .status(500)
      .json(new ApiError(500, null, "Error while fetching products"));
  }
});

// Update Products -- Admin
const updateProducts = asyncHandler(async (req, res) => {
  try {
    const updateProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true },
      { runValidators: true },
      { useFindAndModify: false }
    );
    res
      .status(200)
      .json(new ApiResponse(200, updateProduct, "Updated Successfully"));
  } catch (error) {
    res
      .status(500)
      .json(new ApiError(500, null, "Error while updating product"));
  }
});

// Delete Products
const deleteProducts = asyncHandler(async (req, res) => {
  try {
    const deleteProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deleteProduct) {
      res.status(404).json(new ApiError(404, null, "Product Not Found"));
    }
    res
      .status(200)
      .json(new ApiResponse(200, deleteProduct, "Deleted Successfully"));
  } catch (error) {
    res
      .status(500)
      .json(new ApiError(500, null, "Error while deleting product"));
  }
});

export {
  createProduct,
  getAllProducts,
  updateProducts,
  deleteProducts,
  getProducts,
};
