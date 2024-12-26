// controllers/categoryController.js
const Category = require('../models/category.js');
const fs = require('fs');
const path = require('path');

// Create a new category with image upload
const createCategory = async (req, res) => {
  const { cat_name, detail } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;

  const newCategory = new Category({
    cat_name,
    image_url,
    detail,
  });

  try {
    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a category by ID
const getCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a category by ID
// const updateCategory = async (req, res) => {
//   const { id } = req.params;
//   const { cat_name, detail } = req.body;
//   const image_url = req.file ? `/uploads/${req.file.filename}` : null;

//   try {
//     const updatedCategory = await Category.findByIdAndUpdate(
//       id,
//       { cat_name, detail, image_url },
//       { new: true } // return the updated category
//     );

//     if (!updatedCategory) {
//       return res.status(404).json({ message: 'Category not found' });
//     }

//     res.status(200).json(updatedCategory);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// };


const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { cat_name, detail } = req.body;

  // Check if a new image is uploaded
  let image_url = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    // Find the category to update
    const categoryToUpdate = await Category.findById(id);

    if (!categoryToUpdate) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // If a new image is uploaded and the category already has an old image, delete the old image
    if (image_url && categoryToUpdate.image_url) {
      const oldImagePath = path.join(__dirname, '../uploads', path.basename(categoryToUpdate.image_url));
      
      // Delete the old image if it exists
      fs.unlink(oldImagePath, (err) => {
        if (err) {
          console.error('Error deleting old image file:', err);
        } else {
          console.log('Old image deleted:', oldImagePath);
        }
      });
    }

    // Update the category in the database
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { cat_name, detail, image_url: image_url || categoryToUpdate.image_url },  // Only update image_url if a new one is provided
      { new: true }  // return the updated category
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json(updatedCategory);
  } catch (err) {
    console.error('Error updating category:', err);
    res.status(400).json({ message: err.message });
  }
}

const deleteCategory = async (req, res) => {
  const { id } = req.params;

  // Check if the ID is valid
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ message: 'Invalid category ID format' });
  }

  try {
    // Find the category by ID before deleting
    const categoryToDelete = await Category.findById(id);

    if (!categoryToDelete) {
      return res.status(404).json({ message: 'Category not found' });
    }
    // Delete the image file if it exists
    if (categoryToDelete.image_url) {
      const imagePath = path.join(__dirname, '../uploads', path.basename(categoryToDelete.image_url)); // Correct path

      // Check if the image exists and delete it
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error('Error deleting image file:', err);
        } else {
          console.log('Image deleted:', imagePath);
        }
      });
    }

    // Now delete the category from the database
    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({ message: 'Category and image deleted successfully', category: deletedCategory });
  } catch (err) {
    console.error('Error deleting category:', err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
