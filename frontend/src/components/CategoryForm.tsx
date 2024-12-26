import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const CategoryForm: React.FC = () => {
  const [cat_name, setCatName] = useState<string>('');
  const [detail, setDetail] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch category details for editing
  useEffect(() => {
    if (id) {
      fetchCategory();
    }
  }, [id]);

  const fetchCategory = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3000/api/categories/${id}`);
      const { cat_name, detail, image_url } = response.data;
      setCatName(cat_name);
      setDetail(detail);
      if (image_url) {
        setImagePreview(`http://localhost:3000${image_url}`);
      }
    } catch (error) {
      console.error('Error fetching category:', error);
      setError('Failed to fetch category details.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type (PNG, JPG, JPEG)
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        setError('Only PNG, JPG, or JPEG image files are allowed.');
        setImage(null);
        setImagePreview(null);
        return;
      }

      // Validate file size (max 2MB)
      const maxSize = 2 * 1024 * 1024; // 2MB in bytes
      if (file.size > maxSize) {
        setError('Image size should be less than 2MB.');
        setImage(null);
        setImagePreview(null);
        return;
      }

      // Set new image and preview URL
      setImage(file);
      setImagePreview(URL.createObjectURL(file)); // Generate preview URL
      setError(null); // Clear any previous error
    }
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger the file input click
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('cat_name', cat_name);
    formData.append('detail', detail);

    // Image file validation
    if (image) {
      // Check file type (PNG, JPG, JPEG)
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!validTypes.includes(image.type)) {
        setError('Only PNG, JPG, or JPEG image files are allowed.');
        setLoading(false);
        return;
      }

      // Check file size (2MB max)
      const maxSize = 2 * 1024 * 1024; // 2MB in bytes
      if (image.size > maxSize) {
        setError('Image size should be less than 2MB.');
        setLoading(false);
        return;
      }

      formData.append('image', image);
    }

    try {
      await axios.put(`http://localhost:3000/api/categories/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // Clear form and redirect
      setCatName('');
      setDetail('');
      setImage(null);
      setImagePreview(null);
      navigate('/');
    } catch (error) {
      console.error('Error saving category:', error);
      setError('Failed to save category. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="w-full max-w-md p-4 bg-white shadow-md rounded">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Category Name:</label>
          <input
            type="text"
            className="input_text"
            value={cat_name}
            onChange={(e) => setCatName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Details:</label>
          <textarea
            className="input_text"
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Image:</label>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden" // Hide the input field
            onChange={handleImageChange}
          />
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Category"
              onClick={handleImageClick} // Trigger file input click
              className="h-[200px] w-[200px] object-cover p-2 border rounded cursor-pointer"
              title="Click to change image"
            />
          ) : (
            <div
              className="h-[200px] w-[200px] border flex items-center justify-center p-2 rounded bg-gray-100 text-gray-500 cursor-pointer"
              onClick={handleImageClick}
            >
              100 x 100
            </div>
          )}
          {error && <p className="text-red-500">{error}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  );
};

export default CategoryForm;
