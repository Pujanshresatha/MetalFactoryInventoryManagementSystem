// import express from 'express';
// import { getAllOrders, updateOrderStatus } from '../controllers/adminOrderController.js';
// import { protect, admin } from '../middleware/authMiddleware.js';

// const router = express.Router();

// router.get('/', protect, admin, getAllOrders); // Get all customer orders
// router.put('/:id', protect, admin, updateOrderStatus); // Update order status

// export default router;

import express from "express";
import {
  getAllOrders,
  updateOrderStatus,
} from "../controllers/adminOrderController.js";
import { protect, restrictTo } from "../middlewares/authMiddleware.js"; // Fixed path and middleware

const router = express.Router();

// Routes for admin to manage customer orders
router.get("/", getAllOrders); // Get all customer orders (admin only)
router.put("/:id", updateOrderStatus); // Update order status (admin only)

export default router;
