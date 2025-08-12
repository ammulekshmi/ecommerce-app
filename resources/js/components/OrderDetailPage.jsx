// resources/js/components/OrderDetailPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

function OrderDetailPage() {
    const { id } = useParams(); // Get order ID from URL
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isAuthenticated, authLoading } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrder = async () => {
            if (!authLoading && !isAuthenticated) {
                navigate('/login');
                return;
            }
            if (authLoading) return;

            try {
                const response = await axios.get(`/api/orders/${id}`);
                setOrder(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching order details:", err);
                setError('Failed to fetch order details. ' + (err.response ? err.response.data.message : err.message));
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id, isAuthenticated, authLoading, navigate]);

    if (loading || authLoading) {
        return <div className="text-center mt-5">Loading order details...</div>;
    }

    if (error) {
        return <div className="alert alert-danger mt-5">{error}</div>;
    }

    if (!isAuthenticated) {
        return null; // Redirect handled by useEffect
    }

    if (!order) {
        return <div className="alert alert-warning mt-5 text-center">Order not found.</div>;
    }

    return (
        <div className="container mt-4">
            <div className="card p-4 shadow-sm">
                <h1 className="card-title text-center mb-4">Order Details # {order.id}</h1>

                <div className="row mb-3">
                    <div className="col-md-6">
                        <p><strong>Total Amount:</strong> ${parseFloat(order.total_amount).toFixed(2)}</p>
                        <p><strong>Status:</strong> <span className={`badge bg-${order.status === 'completed' ? 'success' : order.status === 'cancelled' ? 'danger' : 'warning'}`}>{order.status}</span></p>
                        <p><strong>Order Date:</strong> {new Date(order.created_at).toLocaleString()}</p>
                    </div>
                    <div className="col-md-6">
                        <h5>Shipping Address:</h5>
                        <p>
                            {order.shipping_address.full_name}<br/>
                            {order.shipping_address.address_line_1}<br/>
                            {order.shipping_address.address_line_2 && `${order.shipping_address.address_line_2}<br/>`}
                            {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip_code}<br/>
                            {order.shipping_address.country}
                        </p>
                    </div>
                </div>

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
                    <Link to="/orders" className="btn btn-secondary me-3">Back to My Orders</Link>
                    <Link to="/" className="btn btn-primary">Continue Shopping</Link>
                </div>
            </div>
        </div>
    );
}

export default OrderDetailPage;