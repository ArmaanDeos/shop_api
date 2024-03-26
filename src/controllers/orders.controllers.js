import { Order } from "../models/orders.model.js";
import { Product } from "../models/product.models.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiFeatures } from "../utils/features/ApiFeatures.js";

// CREATE NEW ORDER --
const createNewOrder = asyncHandler(async (req, res) => {
  try {
    const {
      shippingInfo,
      orderItems,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;
    const order = await Order.create({
      shippingInfo,
      orderItems,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paidAt: Date.now(),
      user: req.user._id,
    });

    res
      .status(201)
      .json(new ApiResponse(201, order, "Order created successfully"));
  } catch (error) {
    res.status(500).json(new ApiError(500, null, "Error while creating order"));
  }
});

// Get Single Order --
const getSingleOrder = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    // populate() method is used to replace specified paths in a document with document(s) from other collection(s). This is especially useful for resolving references between documents.

    if (!order) throw new ApiError(404, null, "Order Not Found");
    res
      .status(200)
      .json(new ApiResponse(200, order, "Order fetched successfully"));
  } catch (error) {
    res.status(500).json(new ApiError(500, null, "Error while getting order"));
  }
});

// Get All Orders --
const getAllOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find();

    if (!orders || orders.length === 0)
      throw new ApiError(404, null, "Order Not Found");

    // Get total amount (sales)
    const totalAmount = orders.reduce(
      (acc, order) => acc + order.totalPrice,
      0
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { orders, totalAmount },
          "Orders fetched successfully"
        )
      );
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error while fetching orders: " + error.message,
    });
  }
});

// Get LoggedIn User Order --
const getUserOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error while fetching user orders: " + error.message,
    });
  }
});

// Update Order Status --
const updateOrderStatus = asyncHandler(async (req, res) => {
  try {
    // get order
    const order = await Order.findById(req.params.id);
    // check order status --
    if (order.orderStatus === "Delivered")
      throw new ApiError(400, null, "You have already delivered this order");

    // update order status
    order.orderItems.forEach(async (item) => {
      await updateStock(item.product, item.quantity);
    });

    // change status --
    order.orderStatus = req.body.status;

    // get time when order is delivered
    if (req.body.status === "Delivered") {
      order.deliveredAt = Date.now();
    }

    await order.save({ validateBeforeSave: false });
    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error while updating order status: " + error.message,
    });
  }
});

async function updateStock(productId, quantity) {
  const product = await Product.findById(productId);
  product.stock = product.stock - quantity;
  await product.save({ validateBeforeSave: false });
}

// Delete Orders
const deleteOrder = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) throw new ApiError(404, null, "Order Not Found");

    res
      .status(200)
      .json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Error while deleting order" });
  }
});

export {
  createNewOrder,
  getSingleOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
};
