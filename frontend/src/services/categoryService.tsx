import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/';  // You can set the API URL dynamically from env variables

export interface Category {
  _id: string;
  cat_name: string;
  detail: string;
  image_url: string | null;
}

// Get all categories
export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await axios.get(`${API_URL}/api/categories`);
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Failed to fetch categories');
  }
};

// Create a new category
export const createCategory = async (categoryData: FormData): Promise<Category> => {
  try {
    const response = await axios.post(`${API_URL}/api/categories`, categoryData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating category:', error);
    throw new Error('Failed to create category');
  }
};

// Update an existing category
export const updateCategory = async (
  id: string,
  categoryData: FormData
): Promise<Category> => {
  try {
    const response = await axios.put(`${API_URL}/api/categories/${id}`, categoryData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating category:', error);
    throw new Error('Failed to update category');
  }
};

// Delete a category by ID
export const deleteCategory = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/api/categories/${id}`);
  } catch (error) {
    console.error('Error deleting category:', error);
    throw new Error('Failed to delete category');
  }
};
