const Product = require('../models/product.js');
const Category = require('../models/category.js'); // Corrected import

// Get all products
const getProduct = async (req, res) => {
  try {
    const products = await Product.find().populate('category_id', 'cat_name image_url detail');
    res.status(200).json(products);

  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ message: err.message });
  }
};

const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id).populate('category_id', 'cat_name image_url detail');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (err) {
    console.error('Error fetching product by ID:', err);
    res.status(500).json({ message: err.message });
  }
};

// Create a new product
const createProduct = async (req, res) => {
  const { cat_name, category_id, price, sale_price, description } = req.body;

  try {
    // Check if category_id is valid
    if (category_id) {
      const categoryExists = await Category.findById(category_id);
      if (!categoryExists) {
        return res.status(400).json({ message: 'Invalid category_id' });
      }
    }

    const newProduct = new Product({
      cat_name,
      category_id,
      price,
      sale_price,
      description,

    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(400).json({ message: err.message });
  }
};

// Update a product by ID
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { cat_name, category_id, price, sale_price, description } = req.body;

  try {
    // Check if category_id is valid
    if (category_id) {
      const categoryExists = await Category.findById(category_id);
      if (!categoryExists) {
        return res.status(400).json({ message: 'Invalid category_id' });
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { cat_name, category_id, price, sale_price, description },
      { new: true } // Return the updated document
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(updatedProduct);
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(400).json({ message: err.message });
  }
};

// Delete a product by ID
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully', product: deletedProduct });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
};
