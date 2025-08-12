// resources/js/components/OrderConfirmationPage.jsx
import React from 'react';
import { useLocation, Link } from 'react-router-dom';

function OrderConfirmationPage() {
    const location = useLocation();
    const { order } = location.state || {}; // Get order details from navigation state

    if (!order) {
        return (
            <div className="container mt-5 text-center">
                <h2>Order Not Found</h2>
                <p>There was an issue loading your order details, or you navigated directly to this page.</p>
                <Link to="/">Continue Shopping</Link>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <div className="card p-4 shadow-sm">
                <h1 className="card-title text-center text-success mb-4">Order Placed Successfully!</h1>
                <div className="text-center mb-4">
                    <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '3rem' }}></i>
                </div>

                <h4 className="mb-3">Order Details:</h4>
                <p><strong>Order ID:</strong> #{order.id}</p>
                <p><strong>Total Amount:</strong> ${parseFloat(order.total_amount).toFixed(2)}</p>
                <p><strong>Status:</strong> {order.status}</p>
                <p><strong>Order Date:</strong> {new Date(order.created_at).toLocaleString()}</p>

                <h5 className="mt-4 mb-2">Shipping Address:</h5>
                <p>
                    {order.shipping_address.full_name}<br/>
                    {order.shipping_address.address_line_1}<br/>
                    {order.shipping_address.address_line_2 && `${order.shipping_address.address_line_2}<br/>`}
                    {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip_code}<br/>
                    {order.shipping_address.country}
                </p>

                <h5 className="mt-4 mb-2">Items Ordered:</h5>
                <ul className="list-group mb-4">
                    {order.items.map(item => (
                        <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                            <span>{item.quantity} x {item.product.name}</span>
                            <span>${parseFloat(item.price_at_purchase).toFixed(2)} each</span>
                            <span>Total: ${parseFloat(item.quantity * item.price_at_purchase).toFixed(2)}</span>
                        </li>
                    ))}
                </ul>

                <div className="text-center">
                    <Link to="/orders" className="btn btn-info me-3">View My Orders</Link>
                    <Link to="/" className="btn btn-primary">Continue Shopping</Link>
                </div>
            </div>
        </div>
    );
}

export default OrderConfirmationPage;