import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors'; // Add CORS import
import authRoutes from './routes/authRoutes.js';
import adminProductRoutes from "./routes/AdminProductRoutes.js";
import adminUserRoutes from "./routes/AdminUserRoutes.js";
import customerOrderRoutes from "./routes/customerOrderRoutes.js";
import adminOrderRoutes from "./routes/adminOrderRoutes.js";
import cartRoutes from "./routes/cartRoutes.js"; 
import sellerProductRoutes from "./routes/sellerProductRoutes.js"; // Import seller product routes


dotenv.config();

const app = express();

// Enable CORS for frontend origin
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use("/api/admin/products", adminProductRoutes);
app.use("/api/admin", adminUserRoutes); // Mount user routes under /api/admin
app.use("/api/customer/orders", customerOrderRoutes);
app.use("/api/admin/orders", adminOrderRoutes);
app.use("/api/customer/cart", cartRoutes);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('MongoDB connection error:', err));
  // app.get('/', (req, res) => res.send('API running'));