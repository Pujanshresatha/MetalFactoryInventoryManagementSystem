import AdminProduct from "../models/AdminProductModels.js";

const getAdminProducts = async (req, res) => {
  try {
    const products = await AdminProduct.find();
    res.json({
      count: products.length, // Add count of products
      products, // Array of products
    });
  } catch (err) {
    console.error('Error in getAdminProducts:', err.message, err.stack);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

const getAdminProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await AdminProduct.findById(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    console.error("Error in getAdminProductById:", err.message, err.stack);
    res.status(500).json({ error: "Failed to fetch product" });
  }
};

const searchAdminProducts = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }
    const products = await AdminProduct.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ],
    });
    res.json(products);
  } catch (err) {
    console.error("Error in searchAdminProducts:", err.message, err.stack);
    res.status(500).json({ error: "Failed to search products" });
  }
};

const addAdminProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category, imageUrl } = req.body;
    if (!name || !price || !stock || !category) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const product = new AdminProduct({
      name,
      description,
      price: Number(price),
      stock: Number(stock),
      category,
      imageUrl,
    });
    await product.save();
    res.status(201).json({ message: "Product added", product });
  } catch (err) {
    console.error("Error in addAdminProduct:", err.message, err.stack);
    res.status(500).json({ error: "Failed to add product" });
  }
};

const updateAdminProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, category, imageUrl } = req.body;
    if (!name || !price || !stock || !category) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const updatedProduct = await AdminProduct.findByIdAndUpdate(
      id,
      {
        name,
        description,
        price: Number(price),
        stock: Number(stock),
        category,
        imageUrl,
      },
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({ message: "Product updated", product: updatedProduct });
  } catch (err) {
    console.error("Error in updateAdminProduct:", err.message, err.stack);
    res.status(500).json({ error: "Failed to update product" });
  }
};

const deleteAdminProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await AdminProduct.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({ message: "Product deleted" });
  } catch (err) {
    console.error("Error in deleteAdminProduct:", err.message, err.stack);
    res.status(500).json({ error: "Failed to delete product" });
  }
};

export {
  getAdminProducts,
  getAdminProductById,
  searchAdminProducts,
  addAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
};
