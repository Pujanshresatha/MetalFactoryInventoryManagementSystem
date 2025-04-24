import asyncHandler from "express-async-handler";
import Cart from "../models/Cart.js";

// Get customer's cart
const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ customer: req.user.id });
  console.log("Cart found:", cart);
  if (!cart) {
    return res.json({ items: [] }); // Return empty cart if none exists
  }
  res.json(cart);
});

// Save or update customer's cart
const saveCart = asyncHandler(async (req, res) => {
  const { items } = req.body;

  if (!Array.isArray(items)) {
    res.status(400);
    throw new Error("Items must be an array");
  }

  let cart = await Cart.findOne({ customer: req.user.id });

  if (cart) {
    // Update existing cart
    cart.items = items;
    cart.updatedAt = Date.now();
  } else {
    // Create new cart
    cart = new Cart({
      customer: req.user.id,
      items,
    });
  }

  const updatedCart = await cart.save();
  res.json(updatedCart);
});

export { getCart, saveCart };
