// controllers/userController.js
const User = require('../models/user.js');

const getUsers = async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  // Create a new user
  const createUser = async (req, res) => {
    const { name, email } = req.body;
    const user = new User({ name, email });
  
    try {
      const newUser = await user.save();
      res.status(201).json(newUser);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
  
  // Update a user
  const updateUser = async (req, res) => {
    const { id } = req.params;  // Get user ID from the route parameter
    const { name, email } = req.body;
  
    try {
      const updatedUser = await User.findByIdAndUpdate(
        id, 
        { name, email }, 
        { new: true } 
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.json(updatedUser); // Return the updated user
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
  
  // Delete a user
  const deleteUser = async (req, res) => {
    const { id } = req.params; // Get user ID from the route parameter
  
    try {
      const deletedUser = await User.findByIdAndDelete(id);
  
      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.json({ message: "User deleted successfully", user: deletedUser });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  module.exports = {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
  };