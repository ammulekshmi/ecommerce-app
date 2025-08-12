// resources/js/components/Products.jsx
import React, { useState, useEffect, useContext } from 'react'; // Import useContext
import axios from 'axios';
import { CartContext } from '../contexts/CartContext'; // Import CartContext

function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addToCart, cartLoading } = useContext(CartContext); // Use addToCart from context

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('/api/products');
                setProducts(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching products:", err);
                setError('Failed to fetch products. ' + (err.response ? err.response.data.message : err.message));
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleAddToCart = async (productId) => {
        // You can add a quantity selector later, for now, default to 1
        const result = await addToCart(productId, 1);
        if (result.success) {
            alert(result.message); // Or use a more subtle notification system
        } else {
            alert(result.message);
        }
    };

    if (loading) {
        return <div className="text-center">Loading products...</div>;
    }

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    if (products.length === 0) {
        return <div className="text-center">No products found.</div>;
    }

    return (
        <div className="container mt-4">
            <h1>Products</h1>
            <div className="row">
                {products.map(product => (
                    <div className="col-md-4 mb-4" key={product.id}>
                        <div className="card h-100">
                            <img
                                src={product.image ? `/storage/${product.image}` : 'https://via.placeholder.com/250/cccccc/ffffff?text=No+Image'}
                                className="card-img-top"
                                alt={product.name}
                                style={{ maxHeight: '250px', objectFit: 'cover' }}
                            />
                            <div className="card-body">
                                <h5 className="card-title">{product.name}</h5>
                                <p className="card-text">{product.description}</p>
                                <p className="card-text"><strong>Price: ${parseFloat(product.price).toFixed(2)}</strong></p>
                                <p className="card-text">Stock: {product.stock_quantity}</p>
                                <p className="card-text"><small className="text-muted">Category: {product.category ? product.category.name : 'N/A'}</small></p>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => handleAddToCart(product.id)}
                                    disabled={cartLoading} // Disable button while cart is loading/updating
                                >
                                    {cartLoading ? 'Adding...' : 'Add to Cart'}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Products;