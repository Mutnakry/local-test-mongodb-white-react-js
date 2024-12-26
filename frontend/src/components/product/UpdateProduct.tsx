import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

export interface Category {
    _id: string;
    cat_name: string;
    detail: string;
    image_url: string | null;
}

export interface Product {
    _id: string;
    cat_name: string;
    price: number;
    sale_price: number;
    description: string;
    category_id: string;
}

const UpdateProduct: React.FC = () => {
    const { id } = useParams<{ id?: string }>(); // Access the product ID from URL params (optional)
    const [cat_name, setCatName] = useState<string>(''); // Product name
    const [price, setPrice] = useState<number>(0); // Product price
    const [sale_price, setSalePrice] = useState<number>(0); // Sale price
    const [description, setDescription] = useState<string>(''); // Product description
    const [category_id, setCategoryId] = useState<string>(''); // Category ID for product
    const [categories, setCategories] = useState<Category[]>([]); // Categories list
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
        if (id) {
            fetchProduct(id);
        }
    }, [id]);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:3000/api/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setError('Failed to fetch categories. Please check the server or the API URL.');
        } finally {
            setLoading(false);
        }
    };

    const fetchProduct = async (id: string) => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:3000/api/product/${id}`);
            const product = response.data;
            setCatName(product.cat_name);
            setPrice(product.price);
            setSalePrice(product.sale_price);
            setDescription(product.description);
            setCategoryId(product.category_id._id);
            console.log(product.category_id)
            console.log(response.data)
        } catch (error) {
            console.error('Error fetching product:', error);
            setError('Failed to fetch product data.');
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCategoryId(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const updatedProduct = {
            cat_name,
            price,
            sale_price,
            description,
            category_id,
        };

        setLoading(true);
        try {
            await axios.put(`http://localhost:3000/api/product/${id}`, updatedProduct);
            alert('Product updated successfully!');
            navigate('/');
        } catch (error) {
            console.error('Error saving product:', error);
            setError('Failed to save product.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-screen-lg mx-auto">
            <h2 className="text-2xl mb-4">Edit Product</h2>
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
                        value={category_id}
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
                        {loading ? 'Saving...' : 'Update Product'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdateProduct;
