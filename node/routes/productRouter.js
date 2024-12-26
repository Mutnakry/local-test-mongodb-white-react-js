// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controller/ProductController.js');

// Get all users
router.get('/', userController.getProduct);

// Create a new user
router.post('/', userController.createProduct);

router.get('/:id', userController.getProductById); 


// Update a user by ID
router.put('/:id', userController.updateProduct);

// Delete a user by ID
router.delete('/:id', userController.deleteProduct);

module.exports = router;
