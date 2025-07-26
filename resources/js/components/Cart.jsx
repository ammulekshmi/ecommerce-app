import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchCartItems();
    }, []);

    const fetchCartItems = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('/api/cart-items');
            setCartItems(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch cart items. Please log in.');
            setLoading(false);
        }
    };

    const updateQuantity = async (productId, newQuantity) => {
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            await axios.put(`/api/cart-items/${productId}`, { quantity: newQuantity }, {
                headers: { 'X-CSRF-TOKEN': csrfToken }
            });
            setMessage('Quantity updated.');
            fetchCartItems(); // Re-fetch cart items to update UI
        } catch (err) {
            setError('Failed to update quantity.');
            console.error(err.response ? err.response.data : err.message);
        }
    };

    const removeFromCart = async (productId) => {
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            await axios.delete(`/api/cart-items/${productId}`, {
                headers: { 'X-CSRF-TOKEN': csrfToken }
            });
            setMessage('Item removed from cart.');
            fetchCartItems(); // Re-fetch cart items to update UI
        } catch (err) {
            setError('Failed to remove item.');
            console.error(err.response ? err.response.data : err.message);
        }
    };

    const handleCheckout = async () => {
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            const response = await axios.post('/api/checkout', {}, {
                headers: { 'X-CSRF-TOKEN': csrfToken }
            });
            setMessage('Order placed successfully! Order ID: ' + response.data.order.id);
            setCartItems([]); // Clear cart after checkout
            // Optionally redirect to orders page or confirmation
        } catch (err) {
            setError('Checkout failed. ' + (err.response ? err.response.data.message : err.message));
            console.error(err.response ? err.response.data : err.message);
        }
    };


    if (loading) {
        return <div className="text-center">Loading cart...</div>;
    }

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    return (
        <div>
            <h1>Shopping Cart</h1>
            {message && <div className="alert alert-success">{message}</div>}
            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <>
                    <ul className="list-group mb-3">
                        {cartItems.map(item => (
                            <li className="list-group-item d-flex justify-content-between align-items-center" key={item.id}>
                                <div>
                                    <h5>{item.product.name}</h5>
                                    <p>${item.product.price.toFixed(2)} x {item.quantity}</p>
                                </div>
                                <div>
                                    <button
                                        className="btn btn-sm btn-secondary me-2"
                                        onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                                        disabled={item.quantity <= 1}
                                    >
                                        -
                                    </button>
                                    <span className="me-2">{item.quantity}</span>
                                    <button
                                        className="btn btn-sm btn-secondary me-2"
                                        onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                                    >
                                        +
                                    </button>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => removeFromCart(item.product_id)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="text-end">
                        <h4>Total: ${cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0).toFixed(2)}</h4>
                        <button className="btn btn-success" onClick={handleCheckout}>Proceed to Checkout</button>
                    </div>
                </>
            )}
        </div>
    );
}

export default Cart;