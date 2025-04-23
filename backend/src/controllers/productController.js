const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');

const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

const addProduct = asyncHandler(async (req, res) => {
  const { name, manufacturer, description, price, stock } = req.body;
  if (!name || !manufacturer || !price || !stock) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }
  const product = new Product({
    name,
    manufacturer,
    description,
    price,
    stock,
    seller: req.user._id,
  });
  const savedProduct = await product.save();
  res.status(201).json(savedProduct);
});

const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, manufacturer, description, price, stock } = req.body;
  const product = await Product.findById(id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  if (product.seller.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this product');
  }
  product.name = name || product.name;
  product.manufacturer = manufacturer || product.manufacturer;
  product.description = description || product.description;
  product.price = price || product.price;
  product.stock = stock || product.stock;
  const updatedProduct = await product.save();
  res.json(updatedProduct);
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  if (product.seller.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this product');
  }
  await product.remove();
  res.json({ message: 'Product deleted' });
});

module.exports = { getProducts, addProduct, updateProduct, deleteProduct };