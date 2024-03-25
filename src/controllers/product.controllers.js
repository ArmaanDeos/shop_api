import { Product } from "../models/product.models.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiFeatures } from "../utils/features/ApiFeatures.js";

// Create Products -- Admin
const createProduct = asyncHandler(async (req, res) => {
  try {
    // accessing user
    req.body.user = req.user.id;

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
    let resultPerPage = 6; // 5 products per page

    // searching and filtering products...

    const apifeature = new ApiFeatures(Product.find(), req.query)
      .searchProduct() // extends from ApiFeatures
      .filterProduct() // extends from ApiFeatures
      .pagination(resultPerPage);

    const productCount = await Product.countDocuments();

    const products = await apifeature.query;
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          products,
          productCount,
          "Products fetched Successfully"
        )
      );
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

// Create Product New Review / Update Review
const createProductReviewAndUpdateReview = asyncHandler(async (req, res) => {
  const { rating, comment, productId } = req.body;
  const review = {
    user: req.user.id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  try {
    const product = await Product.findById(productId);
    if (!product) throw new ApiError(404, null, "Product Not Found");

    // check if product has review or not
    const isReviewed = product.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString()
    );

    // if product has review then update review if not then add review
    if (isReviewed) {
      product.reviews.forEach((rev) => {
        if (rev.user.toString() === req.user._id.toString()) {
          rev.rating = rating;
          rev.comment = comment;
        }
      });
    } else {
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
    }

    // find average rating
    product.ratings = product.reviews.reduce(
      (acc, item) => item.rating + acc,
      0
    );
    product.ratings = product.ratings / product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: "Product review created successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json(new ApiError(500, null, "Error while creating review"));
  }
});

// Get Product Reviews
const getProductReviews = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.query.id);
    if (!product) throw new ApiError(404, null, "Product Not Found");

    res.status(200).json({
      success: true,
      reviews: product.reviews,
      message: "Reviews fetched successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json(new ApiError(500, null, "Error while getting reviews"));
  }
});

// Delete Product Reviews
const deleteProductReviews = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.query.productId);
    if (!product) throw new ApiError(404, null, "Product Not Found");

    // Filter out the review to be deleted
    const updatedReviews = product.reviews.filter(
      (rev) => rev._id.toString() !== req.query.reviewId.toString()
    );

    // Calculate the new average rating and number of reviews
    const sumOfRatings = updatedReviews.reduce(
      (acc, item) => acc + item.rating,
      0
    );
    const newAverageRating = sumOfRatings / updatedReviews.length;
    const numOfReviews = updatedReviews.length;

    // Update the product with the new reviews, average rating, and number of reviews
    const updatedProduct = await Product.findByIdAndUpdate(
      req.query.productId,
      {
        $set: {
          reviews: updatedReviews,
          ratings: newAverageRating,
          numOfReviews: numOfReviews,
        },
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
      updatedProduct: updatedProduct, // Optional: Send back the updated product for verification
    });
  } catch (error) {
    res
      .status(500)
      .json(
        new ApiError(500, null, "Error while deleting review", error.message)
      );
  }
});

export {
  createProduct,
  getAllProducts,
  updateProducts,
  deleteProducts,
  getProducts,
  createProductReviewAndUpdateReview,
  getProductReviews,
  deleteProductReviews,
};
