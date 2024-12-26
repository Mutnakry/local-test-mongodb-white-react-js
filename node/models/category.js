// models/categories.js
const mongoose = require('mongoose');

// Define the Categories schema
const CategoriesSchema = new mongoose.Schema({
  cat_name: { type: String, required: true },
  image_url: { type: String, required: false }, 
  detail: { type: String, required: false  },   
});

const Category = mongoose.model('categories', CategoriesSchema);

module.exports = Category;

