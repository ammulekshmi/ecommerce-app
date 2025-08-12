//Create a dedicated page to view and manage the cart.
import React, { useContext } from 'react';
import { CartContext } from '../contexts/CartContext';
import { Link } from 'react-router-dom'; // Will need react-router-dom later

function CartPage() {
    const { cart, cartLoading, cartError, updateCartItemQuantity, removeCartItem } = useContext(CartContext);

    if (cartLoading) {
        return <div className="text-center mt-5">Loading cart...</div>;
    }

    if (cartError) {
        return <div className="alert alert-danger mt-5">{cartError}</div>;
    }

    const handleQuantityChange = async (cartItemId, currentQuantity, change) => {
        const newQuantity = currentQuantity + change;
        if (newQuantity < 0) return; // Prevent negative quantity

        await updateCartItemQuantity(cartItemId, newQuantity);
    };

    const handleRemoveItem = async (cartItemId) => {
        if (window.confirm("Are you sure you want to remove this item from your cart?")) {
            await removeCartItem(cartItemId);
        }
    };

    return (
        <div className="container mt-4">
            <h1>Your Shopping Cart</h1>
            {cart.items.length === 0 ? (
                <div className="alert alert-info">
                    Your cart is empty. <Link to="/">Start shopping!</Link>
                </div>
            ) : (
                <>
                    <div className="row">
                        <div className="col-md-8">
                            {cart.items.map(item => (
                                <div key={item.id} className="card mb-3">
                                    <div className="row g-0">
                                        <div className="col-md-3">
                                            <img
                                                src={item.product_image ? `/storage/${item.product_image}` : 'https://via.placeholder.com/150'}
                                                className="img-fluid rounded-start"
                                                alt={item.product_name}
                                                style={{ maxHeight: '150px', objectFit: 'cover' }}
                                            />
                                        </div>
                                        <div className="col-md-9">
                                            <div className="card-body">
                                                <h5 className="card-title">{item.product_name}</h5>
                                                <p className="card-text">Price: ${parseFloat(item.product_price).toFixed(2)}</p>
                                                <div className="d-flex align-items-center mb-2">
                                                    <button
                                                        className="btn btn-sm btn-outline-secondary"
                                                        onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                                                        disabled={cartLoading}
                                                    >
                                                        -
                                                    </button>
                                                    <span className="mx-2">{item.quantity}</span>
                                                    <button
                                                        className="btn btn-sm btn-outline-secondary"
                                                        onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                                                        disabled={cartLoading}
                                                    >
                                                        +
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-danger ms-3"
                                                        onClick={() => handleRemoveItem(item.id)}
                                                        disabled={cartLoading}
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                                <p className="card-text">Total: ${parseFloat(item.total_item_price).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="col-md-4">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Cart Summary</h5>
                                    <p className="card-text">Total Items: {cart.items.length}</p>
                                    <p className="card-text fs-4"><strong>Subtotal: ${parseFloat(cart.cart_total).toFixed(2)}</strong></p>
                                    <Link to="/checkout" className="btn btn-success w-100" disabled={cartLoading}>
                                        Proceed to Checkout
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default CartPage;