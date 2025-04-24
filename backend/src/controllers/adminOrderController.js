// import Order from "../models/Order.js";

// export const getAllOrders = async (req, res) => {
//   try {
//     const orders = await Order.find()
//       .populate("customerId", "username email")
//       .populate("items.productId", "name")
//       .sort({ createdAt: -1 });
//     res.status(200).json(orders);
//   } catch (error) {
//     res.status(500).json({ error: "Error fetching orders: " + error.message });
//   }
// };

// export const updateOrderStatus = async (req, res) => {
//   const { id } = req.params;
//   const { status } = req.body;

//   try {
//     const order = await Order.findById(id);
//     if (!order) {
//       return res.status(404).json({ error: "Order not found" });
//     }
//     order.status = status;
//     await order.save();
//     res.status(200).json(order);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ error: "Error updating order status: " + error.message });
//   }
// };

import asyncHandler from "express-async-handler";
import Order from "../models/Order.js";

// Get all orders (admin only)
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate("products.productId")
    .populate("customer", "username email");
  res.json(orders);
});

// Update order status (admin only)
const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  const { status } = req.body;
  if (
    !["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].includes(
      status
    )
  ) {
    res.status(400);
    throw new Error("Invalid status");
  }

  order.status = status;
  order.updatedAt = Date.now();
  await order.save();

  res.json({ message: "Order status updated successfully" });
});

export { getAllOrders, updateOrderStatus };
