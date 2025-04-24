import express from "express";
import { getCart, saveCart } from "../controllers/cartController.js";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Protect all routes with authentication middleware and restrict to Customer role
router
  .route("/")
  .get(protect, restrictTo("Customer"), getCart)
  .post(protect, restrictTo("Customer"), saveCart);

export default router;
