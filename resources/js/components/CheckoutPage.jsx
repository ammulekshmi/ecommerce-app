// resources/js/components/CheckoutPage.jsx
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';

function CheckoutPage() {
    const { cart, cartLoading, cartError, fetchCart, clearCart } = useContext(CartContext);
    const { isAuthenticated, user, authLoading } = useContext(AuthContext);
    const navigate = useNavigate();

    const [shippingAddress, setShippingAddress] = useState({
        full_name: '',
        address_line_1: '',
        address_line_2: '',
        city: '',
        state: '',
        zip_code: '',
        country: '',
    });
    const [sameAsShipping, setSameAsShipping] = useState(true);
    const [billingAddress, setBillingAddress] = useState({
        full_name: '',
        address_line_1: '',
        address_line_2: '',
        city: '',
        state: '',
        zip_code: '',
        country: '',
    });
    const [checkoutProcessing, setCheckoutProcessing] = useState(false);
    const [checkoutError, setCheckoutError] = useState(null);

    // Redirect if not authenticated or cart is empty
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate('/login');
            alert('Please log in to proceed to checkout.');
        }
        if (!cartLoading && cart.items.length === 0) {
            navigate('/cart');
            alert('Your cart is empty. Please add items to proceed.');
        }
    }, [isAuthenticated, authLoading, cart.items.length, cartLoading, navigate]);

    const handleShippingChange = (e) => {
        const { name, value } = e.target;
        setShippingAddress(prev => ({ ...prev, [name]: value }));
    };

    const handleBillingChange = (e) => {
        const { name, value } = e.target;
        setBillingAddress(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCheckoutProcessing(true);
        setCheckoutError(null);

        const orderData = {
            shipping_address: shippingAddress,
            billing_address: sameAsShipping ? shippingAddress : billingAddress,
        };

        try {
            const response = await axios.post('/api/checkout', orderData);
            alert(response.data.message);
            clearCart(); // Clear local cart state after successful order
            navigate('/order-confirmation', { state: { order: response.data.order } }); // Redirect to a confirmation page
        } catch (err) {
            console.error('Checkout error:', err.response || err);
            setCheckoutError(err.response?.data?.message || 'Checkout failed. Please try again.');
        } finally {
            setCheckoutProcessing(false);
        }
    };

    if (authLoading || cartLoading) {
        return <div className="text-center mt-5">Loading checkout...</div>;
    }

    if (!isAuthenticated) {
        return null; // Redirect handled by useEffect
    }

    if (cart.items.length === 0) {
        return null; // Redirect handled by useEffect
    }

    return (
        <div className="container mt-4">
            <h1>Checkout</h1>
            {checkoutError && <div className="alert alert-danger">{checkoutError}</div>}
            <div className="row">
                <div className="col-md-7">
                    <div className="card mb-4">
                        <div className="card-header">Shipping Address</div>
                        <div className="card-body">
                            <form>
                                {/* Shipping Address Fields */}
                                <div className="mb-3">
                                    <label className="form-label">Full Name</label>
                                    <input type="text" className="form-control" name="full_name" value={shippingAddress.full_name} onChange={handleShippingChange} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Address Line 1</label>
                                    <input type="text" className="form-control" name="address_line_1" value={shippingAddress.address_line_1} onChange={handleShippingChange} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Address Line 2 (Optional)</label>
                                    <input type="text" className="form-control" name="address_line_2" value={shippingAddress.address_line_2} onChange={handleShippingChange} />
                                </div>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">City</label>
                                        <input type="text" className="form-control" name="city" value={shippingAddress.city} onChange={handleShippingChange} required />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">State/Province</label>
                                        <input type="text" className="form-control" name="state" value={shippingAddress.state} onChange={handleShippingChange} required />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Zip/Postal Code</label>
                                        <input type="text" className="form-control" name="zip_code" value={shippingAddress.zip_code} onChange={handleShippingChange} required />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Country</label>
                                        <input type="text" className="form-control" name="country" value={shippingAddress.country} onChange={handleShippingChange} required />
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="card mb-4">
                        <div className="card-header">Billing Address</div>
                        <div className="card-body">
                            <div className="form-check mb-3">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="sameAsShipping"
                                    checked={sameAsShipping}
                                    onChange={(e) => setSameAsShipping(e.target.checked)}
                                />
                                <label className="form-check-label" htmlFor="sameAsShipping">
                                    Same as shipping address
                                </label>
                            </div>
                            {!sameAsShipping && (
                                <form>
                                    {/* Billing Address Fields (similar to shipping) */}
                                    <div className="mb-3">
                                        <label className="form-label">Full Name</label>
                                        <input type="text" className="form-control" name="full_name" value={billingAddress.full_name} onChange={handleBillingChange} required={!sameAsShipping} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Address Line 1</label>
                                        <input type="text" className="form-control" name="address_line_1" value={billingAddress.address_line_1} onChange={handleBillingChange} required={!sameAsShipping} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Address Line 2 (Optional)</label>
                                        <input type="text" className="form-control" name="address_line_2" value={billingAddress.address_line_2} onChange={handleBillingChange} />
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">City</label>
                                            <input type="text" className="form-control" name="city" value={billingAddress.city} onChange={handleBillingChange} required={!sameAsShipping} />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">State/Province</label>
                                            <input type="text" className="form-control" name="state" value={billingAddress.state} onChange={handleBillingChange} required={!sameAsShipping} />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Zip/Postal Code</label>
                                            <input type="text" className="form-control" name="zip_code" value={billingAddress.zip_code} onChange={handleBillingChange} required={!sameAsShipping} />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Country</label>
                                            <input type="text" className="form-control" name="country" value={billingAddress.country} onChange={handleBillingChange} required={!sameAsShipping} />
                                        </div>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>

                    <div className="card mb-4">
                        <div className="card-header">Payment Information (Placeholder)</div>
                        <div className="card-body">
                            <p>For this demo, payment is simulated upon order placement.</p>
                            {/* In a real application, you'd integrate a payment gateway form here (e.g., Stripe Elements, PayPal Button) */}
                            {/* <div className="mb-3">
                                <label htmlFor="cardNumber" className="form-label">Card Number</label>
                                <input type="text" className="form-control" id="cardNumber" placeholder="**** **** **** ****" required />
                            </div>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="expiryDate" className="form-label">Expiry Date</label>
                                    <input type="text" className="form-control" id="expiryDate" placeholder="MM/YY" required />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="cvc" className="form-label">CVC</label>
                                    <input type="text" className="form-control" id="cvc" placeholder="CVC" required />
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>

                <div className="col-md-5">
                    <div className="card">
                        <div className="card-header">Order Summary</div>
                        <div className="card-body">
                            {cart.items.map(item => (
                                <div key={item.id} className="d-flex justify-content-between align-items-center mb-2">
                                    <span>{item.quantity} x {item.product_name}</span>
                                    <span>${parseFloat(item.total_item_price).toFixed(2)}</span>
                                </div>
                            ))}
                            <hr />
                            <h5 className="d-flex justify-content-between">
                                <span>Total:</span>
                                <span>${parseFloat(cart.cart_total).toFixed(2)}</span>
                            </h5>
                            <button
                                type="submit"
                                className="btn btn-success w-100 mt-3"
                                onClick={handleSubmit}
                                disabled={checkoutProcessing || cart.items.length === 0}
                            >
                                {checkoutProcessing ? 'Processing...' : 'Place Order'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CheckoutPage;