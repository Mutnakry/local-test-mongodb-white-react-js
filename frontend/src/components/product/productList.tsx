import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export interface Product {
    _id: string;
    cat_name: string;
    price: number;
    sale_price: number;
    description: string;
    detail: string;
    category_id: {
        cat_name: string | null;
        detail: string | null;
        image_url: string | null;
    } | null;
}

const ProductList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        if (searchTerm) {
            setFilteredProducts(
                products.filter(
                    (product) =>
                        product.cat_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        product.description.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        } else {
            setFilteredProducts(products);
        }
    }, [searchTerm, products]);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/product');
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
            setError('Failed to fetch products. Please check the server or the API URL.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        const confirmed = window.confirm('Are you sure you want to delete this product?');
        if (!confirmed) return;

        try {
            // Optimistic UI update: remove the product immediately
            const updatedProducts = products.filter((product) => product._id !== id);
            setProducts(updatedProducts);

            await axios.delete(`http://localhost:3000/api/product/${id}`);
        } catch (error) {
            console.error('Error deleting product:', error);
            setError('Failed to delete product. Restoring the deleted item.');
            fetchProducts();
        }
    };

    if (loading) {
        return <p>Loading products...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.src = 'default-image-url.png'; // Fallback image
    };

    return (
        <div className="max-w-screen-lg mx-auto">
            <div className="flex justify-between mb-4">
                <Link to="/product" className="button_add_tempo_submit">
                    Add Product
                </Link>
                <input
                    type="text"
                    placeholder="Search Product Name ..."
                    className="input_text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} // Update search term
                />
            </div>
            <table className="min-w-full">
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>Details</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Image</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProducts.map((product) => (
                        <tr key={product._id}>
                            <td>{product.cat_name}</td>
                            <td>{product.category_id?.detail || 'No details available'}</td>
                            <td>{product.category_id?.cat_name || 'No category available'}</td>
                            <td>{formatCurrency(product.price)}</td>
                            <td>{formatCurrency(product.sale_price)}</td>
                            <td>{product.description || 'Null'}</td>
                            <td>
                                {product.category_id?.image_url ? (
                                    <img
                                        src={`http://localhost:3000${product.category_id?.image_url}`}
                                        alt={product.cat_name}
                                        className="h-[100px] w-[100px] object-cover rounded-md"
                                        onError={handleImageError}
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-[100px] w-[100px] text-2xl bg-slate-200 rounded-md">
                                        <span className="text-gray-400 text-sm">100 x 100</span>
                                    </div>
                                )}
                            </td>

                            <td>
                                <Link to={`product/${product._id}`} className="mr-4 text-blue-600 hover:text-blue-800">
                                    Edit
                                </Link>
                                <button
                                    onClick={() => handleDelete(product._id)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductList;
