// routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../config/multerConfig.js');  // Import multer configuration
const categoryController = require('../controller/CategoryController.js');

// Create a new category with image upload
router.post('/', upload.single('image'), categoryController.createCategory);

// Get all categories
router.get('/', categoryController.getCategories);

// Get a category by ID
router.get('/:id', categoryController.getCategoryById);

// Update a category by ID
router.put('/:id', upload.single('image'), categoryController.updateCategory);

// Delete a category by ID
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
