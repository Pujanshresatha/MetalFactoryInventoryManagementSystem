// import asyncHandler from "express-async-handler";
// import Order from "../models/Order.js";
// import Product from "../models/Product.js"; // Fixed import

// // Create a new order
// const createOrder = asyncHandler(async (req, res) => {
//   const { products, totalAmount } = req.body;

//   // Validate products and check stock
//   for (const item of products) {
//     const product = await Product.findById(item.productId);
//     if (!product) {
//       res.status(404);
//       throw new Error(`Product not found: ${item.productId}`);
//     }
//     if (product.stock < item.quantity) {
//       res.status(400);
//       throw new Error(`Insufficient stock for product: ${product.name}`);
//     }
//   }

//   // Update product stock
//   for (const item of products) {
//     const product = await Product.findById(item.productId);
//     product.stock -= item.quantity;
//     product.updatedAt = Date.now();
//     await product.save();
//   }

//   const order = new Order({
//     customer: req.user.id,
//     products,
//     totalAmount,
//     status: "Pending",
//   });

//   const createdOrder = await order.save();
//   res.status(201).json(createdOrder);
// });

// // Get all orders for the logged-in customer
// const getOrdersByCustomer = asyncHandler(async (req, res) => {
//   const orders = await Order.find({ customer: req.user.id }).populate(
//     "products.productId"
//   );
//   res.json(orders);
// });

// // Get a specific order by ID
// const getOrderById = asyncHandler(async (req, res) => {
//   const order = await Order.findById(req.params.id).populate(
//     "products.productId"
//   );
//   if (!order) {
//     res.status(404);
//     throw new Error("Order not found");
//   }
//   if (order.customer.toString() !== req.user.id) {
//     res.status(403);
//     throw new Error("Not authorized to view this order");
//   }
//   res.json(order);
// });

// export { createOrder, getOrdersByCustomer, getOrderById };

import asyncHandler from "express-async-handler";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

// Create a new order
const createOrder = asyncHandler(async (req, res) => {
  const { products, totalAmount } = req.body;

  // Validate input
  if (!products || !Array.isArray(products) || products.length === 0) {
    res.status(400);
    throw new Error("Products array is required and cannot be empty");
  }
  if (!totalAmount || totalAmount <= 0) {
    res.status(400);
    throw new Error("Total amount must be greater than 0");
  }

  // Validate products and check stock
  for (const item of products) {
    if (!item.productId || !item.quantity || item.quantity <= 0) {
      res.status(400);
      throw new Error("Each product must have a valid productId and quantity");
    }

    const product = await Product.findById(item.productId);
    if (!product) {
      res.status(404);
      throw new Error(`Product not found: ${item.productId}`);
    }
    if (product.stock < item.quantity) {
      res.status(400);
      throw new Error(`Insufficient stock for product: ${product.name}`);
    }
  }

  // Update product stock
  for (const item of products) {
    const product = await Product.findById(item.productId);
    product.stock -= item.quantity;
    product.updatedAt = Date.now();
    await product.save();
  }

  // Create the order
  const order = new Order({
    customer: req.user.id,
    products,
    totalAmount,
    status: "Pending",
  });

  const createdOrder = await order.save();

  // Populate the products for the response
  const populatedOrder = await Order.findById(createdOrder._id).populate(
    "products.productId"
  );
  res.status(201).json(populatedOrder);
});

// Get all orders for the logged-in customer
const getOrdersByCustomer = asyncHandler(async (req, res) => {
  const orders = await Order.find({ customer: req.user.id })
    .populate("products.productId")
    .populate("customer", "username email");
  res.json(orders);
});

// Get a specific order by ID
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("products.productId")
    .populate("customer", "username email");
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  if (order.customer._id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("Not authorized to view this order");
  }
  res.json(order);
});

export { createOrder, getOrdersByCustomer, getOrderById };
