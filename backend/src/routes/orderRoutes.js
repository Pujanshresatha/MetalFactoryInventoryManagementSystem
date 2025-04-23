const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getCart, addToCart, updateCartItem, removeCartItem, clearCart } = require('../controllers/orderController');

router.get('/cart', protect, getCart);
router.post('/cart', protect, addToCart);
router.put('/cart/:itemId', protect, updateCartItem);
router.delete('/cart/:itemId', protect, removeCartItem);
router.delete('/cart', protect, clearCart);

module.exports = router;