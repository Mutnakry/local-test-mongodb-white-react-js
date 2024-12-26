import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export interface Category {
    _id: string;
    cat_name: string;
    detail: string;
    image_url: string | null;
}

const CreateProduct: React.FC = () => {
    const [cat_name, setCatName] = useState<string>('');
    const [price, setPrice] = useState<number>(0);
    const [sale_price, setSalePrice] = useState<number>(0);
    const [description, setDescription] = useState<string>('');
    const [category_id, setCategoryId] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const Navigetor = useNavigate();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true); // Set loading to true when fetching categories
        try {
            const response = await axios.get('http://localhost:3000/api/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setError('Failed to fetch categories. Please check the server or the API URL.');
        } finally {
            setLoading(false); // Set loading to false after fetching categories
        }
    };

    // Handle category change in the select dropdown
    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCategoryId(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newProduct = {
            cat_name,
            price,
            sale_price,
            description,
            category_id, // Reference the selected category ID
        };

        setLoading(true);
        try {
            await axios.post('http://localhost:3000/api/product', newProduct);
            alert('Product created successfully!');
            Navigetor('/');
        } catch (error) {
            console.error('Error creating product:', error);
            setError('Failed to create product.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-screen-lg mx-auto">
            <h2 className="text-2xl mb-4">Add New Product</h2>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="cat_name" className="block text-sm font-semibold">Product Name</label>
                    <input
                        type="text"
                        id="cat_name"
                        value={cat_name}
                        onChange={(e) => setCatName(e.target.value)}
                        className="input_text"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="price" className="block text-sm font-semibold">Price</label>
                    <input
                        type="number"
                        id="price"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        className="input_text"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="sale_price" className="block text-sm font-semibold">Sale Price</label>
                    <input
                        type="number"
                        id="sale_price"
                        value={sale_price}
                        onChange={(e) => setSalePrice(Number(e.target.value))}
                        className="input_text"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="description" className="block text-sm font-semibold">Description</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="input_text"
                    />
                </div>

                <div className="mb-4">
                    <label>Category</label>
                    <select
                        name="category_id"
                        value={category_id ?? ''}
                        onChange={handleCategoryChange}
                        className="input_text"
                    >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                            <option key={category._id} value={category._id}>
                                {category.cat_name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="button_add_tempo_submit"
                    >
                        {loading ? 'Creating...' : 'Create Product'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateProduct;
