const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  status: { type: String, required: true, default: 'cart' },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' },
      quantity: { type: Number, required: true, default: 1 },
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);