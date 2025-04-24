import express from "express";
import {
  getAdminProducts,
  getAdminProductById,
  searchAdminProducts,
  addAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
} from "../controllers/AdminProductController.js";

const router = express.Router();

router.get("/", getAdminProducts);
router.get("/search", searchAdminProducts);
router.get("/:id", getAdminProductById);
router.post("/", addAdminProduct);
router.put("/:id", updateAdminProduct);
router.delete("/:id", deleteAdminProduct);

export default router;
