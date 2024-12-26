// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controller/userController.js');

// Get all users
router.get('/', userController.getUsers);

// Create a new user
router.post('/', userController.createUser);

// Update a user by ID
router.put('/:id', userController.updateUser);

// Delete a user by ID
router.delete('/:id', userController.deleteUser);

module.exports = router;
