const asyncHandler = require('express-async-handler');
const Order = require('../models/orderModel');

const getCart = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ user: req.user._id, status: 'cart' });
  if (!order) return res.status(200).json([]);
  res.json(order.items);
});

const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  let order = await Order.findOne({ user: req.user._id, status: 'cart' });
  if (!order) {
    order = new Order({ user: req.user._id, status: 'cart', items: [] });
  }
  const itemIndex = order.items.findIndex((item) => item.product.toString() === productId);
  if (itemIndex > -1) {
    order.items[itemIndex].quantity += quantity;
  } else {
    order.items.push({ product: productId, quantity });
  }
  await order.save();
  res.json(order.items);
});

const updateCartItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const { quantity } = req.body;
  const order = await Order.findOne({ user: req.user._id, status: 'cart' });
  if (!order) return res.status(404).json({ message: 'Cart not found' });
  const item = order.items.id(itemId);
  if (!item) return res.status(404).json({ message: 'Item not found' });
  item.quantity = quantity;
  await order.save();
  res.json(order.items);
});

const removeCartItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const order = await Order.findOne({ user: req.user._id, status: 'cart' });
  if (!order) return res.status(404).json({ message: 'Cart not found' });
  order.items = order.items.filter((item) => item._id.toString() !== itemId);
  await order.save();
  res.json(order.items);
});

const clearCart = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ user: req.user._id, status: 'cart' });
  if (order) {
    order.items = [];
    await order.save();
  }
  res.json([]);
});

module.exports = { getCart, addToCart, updateCartItem, removeCartItem, clearCart };