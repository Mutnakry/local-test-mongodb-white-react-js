const mongoose = require('mongoose');

// Define the Products schema
const ProductSchema = new mongoose.Schema({
  cat_name: { type: String, required: true }, // Category name
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'categories', required: false }, // Reference to a category
  price: { type: Number, required: true }, // Regular price of the product
  sale_price: { type: Number, required: false }, // Sale price of the product (optional)
  description: { type: String, required: false } 
});

// Create the model from the schema
const Product = mongoose.model('products', ProductSchema);

module.exports = Product;
