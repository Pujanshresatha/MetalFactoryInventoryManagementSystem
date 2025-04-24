// import express from "express";
// import {
//   createOrder,
//   getOrders,
// } from "../controllers/customerOrderController.js";
// import { protect } from "../middleware/authMiddleware.js";

// const router = express.Router();

// router.post("/", protect, createOrder); // Create a new order
// router.get("/", protect, getOrders); // Get all orders for the customer

// export default router;

import express from "express";
import {
  createOrder,
  getOrdersByCustomer,
  getOrderById,
} from "../controllers/customerOrderController.js";
import { protect, restrictTo } from "../middlewares/authMiddleware.js"; // Fixed path

const router = express.Router();

// Routes for customer orders
router
  .route("/")
  .post(protect, restrictTo("Customer"), createOrder) // Create a new order (protected)
  .get(protect, restrictTo("Customer"), getOrdersByCustomer); // Get all orders for the logged-in customer (protected)

router.route("/:id").get(protect, restrictTo("Customer"), getOrderById); // Get a specific order by ID (protected)

export default router;
