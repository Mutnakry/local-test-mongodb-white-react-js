


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export interface Category {
  _id: string;
  cat_name: string;
  detail: string;
  image_url: string | null;
}

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      setFilteredCategories(
        categories.filter((category) =>
          category.cat_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          category.detail.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredCategories(categories);
    }
  }, [searchTerm, categories]);

  // Fetch categories from the API
  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/categories');
      setCategories(response.data);
      setFilteredCategories(response.data); // Initialize filtered categories
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to fetch categories. Please check the server or the API URL.');
    } finally {
      setLoading(false);
    }
  };

  // Handle deletion of a category
  const handleDelete = async (id: string) => {
    try {
      // Optimistic UI update: remove the category immediately
      setCategories(categories.filter((category) => category._id !== id));
      await axios.delete(`http://localhost:3000/api/categories/${id}`);
    } catch (error) {
      console.error('Error deleting category:', error);
      setError('Failed to delete category. Restoring the deleted item.');
      fetchCategories();
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCategories.slice(indexOfFirstItem, indexOfLastItem);

  // Change page handler
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredCategories.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  // Handle change of items per page
  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedItemsPerPage = Number(e.target.value);
    setItemsPerPage(selectedItemsPerPage);
    setCurrentPage(1);
  };

  return (
    <div className="max-w-screen-lg mx-auto mt-10">
      <div className="flex justify-between mb-4">
        <Link to="/categories" className="button_add_tempo_submit">Add</Link>
        <input
          type="text"
          placeholder="Search Category Name ..."
          className="input_text w-[450px]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="mb-4 text-end">
        <select
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
          className="p-2 bg-slate-200 rounded"
        >
          <option value="1">1</option>
          <option value="5">5</option>
          <option value="15">15</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>id</th>
            <th>Name</th>
            <th>Details</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((category) => (
            <tr key={category._id}>
              <td>{category._id}</td>
              <td>{category.cat_name}</td>
              <td>{category.detail}</td>
              <td>
                {category.image_url ? (
                  <img
                    src={`http://localhost:3000${category.image_url}`} // Adjusting image URL for full path
                    alt={category.cat_name}
                    className="h-[100px] w-[100px] object-cover rounded-md"
                  />
                ) : (
                  <div className="flex items-center justify-center h-[100px] w-[100px] text-2xl bg-slate-200 rounded-md">
                    <span className="text-gray-400 text-sm">100 x 100</span>
                  </div>
                )}
              </td>

              <td className='space-x-4'>
                <Link className='text-white py-2 px-3 bg-blue-500 rounded-md' to={`categories/${category._id}`}>Edit</Link>
                <button className='text-white py-1 px-3 bg-blue-500 rounded-md' onClick={() => handleDelete(category._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination controls */}
      <div className="pagination mt-4 items-end flex justify-end">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
        >
          Previous
        </button>
        {pageNumbers.map(number => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={`px-4 py-2 mx-1 ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded`}
          >
            {number}
          </button>
        ))}
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === pageNumbers.length}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CategoryList;
