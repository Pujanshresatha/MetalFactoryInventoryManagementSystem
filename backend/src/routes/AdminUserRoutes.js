import express from "express";
import {
  getAllUsers,
  updateUserRole,
  deleteUser,
  resetUserPassword,
} from "../controllers/AdminUserController.js";
import { authMiddleware, restrictTo } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Middleware to protect routes and restrict to Admin role
router.use(authMiddleware);
router.use(restrictTo("Admin"));

// Routes
router.get("/users", getAllUsers);
router.put("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);
router.put("/users/:id/reset-password", resetUserPassword);

export default router;
