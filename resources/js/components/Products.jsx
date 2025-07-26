import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('/api/products');
                setProducts(response.data);
                setLoading(false);
            } catch (err) {
                console.error("API error details:", err); // Log the full error for more info
                setError('Failed to fetch products. ' + (err.response ? err.response.data.message || JSON.stringify(err.response.data) : err.message));
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Conditional rendering for loading and error states
    if (loading) {
        // alert('loading'); // Keep alerts for quick debugging, but remove for production
        return <div className="text-center">Loading products...</div>;
    }

    if (error) {
        // alert('error'); // Keep alerts for quick debugging, but remove for production
        return <div className="alert alert-danger">{error}</div>;
    }

    // Check if products array is empty after loading
    if (products.length === 0) {
        return <div className="text-center">No products found.</div>;
    }

    return (
        <div className="container mt-4"> {/* Added a Bootstrap container for better layout */}
            <h1>Products</h1>
            <div className="row">
                {products.map(product => (
                    <div className="col-md-4 mb-4" key={product.id}>
                        <div className="card h-100">
                            {/* FIX 1: Correct image URL construction */}
                            <img
                                src={product.image ? `/storage/${product.image}` : 'https://via.placeholder.com/250/cccccc/ffffff?text=No+Image'}
                                className="card-img-top"
                                alt={product.name}
                                style={{ maxHeight: '250px', objectFit: 'cover' }} // Added inline style for image sizing
                            />
                            <div className="card-body">
                                <h5 className="card-title">{product.name}</h5>
                                <p className="card-text">{product.description}</p>
                                {/* FIX 2: Ensure price is parsed as a float before toFixed */}
                                <p className="card-text"><strong>Price: ${parseFloat(product.price).toFixed(2)}</strong></p>
                                {/* FIX 3: Correct property name from stock to stock_quantity */}
                                <p className="card-text">Stock: {product.stock_quantity}</p>
                                {/* Ensure product.category and product.category.name exist before accessing */}
                                <p className="card-text"><small className="text-muted">Category: {product.category ? product.category.name : 'N/A'}</small></p>
                                <button className="btn btn-primary">Add to Cart</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Products;