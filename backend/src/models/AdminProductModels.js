import mongoose from "mongoose";

const adminProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  category: { type: String, required: true },
  imageUrl: { type: String }, // New field for product image URL
  createdAt: { type: Date, default: Date.now }, // New field for creation date
});

export default mongoose.model("AdminProduct", adminProductSchema);
