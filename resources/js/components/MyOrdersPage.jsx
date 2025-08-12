// resources/js/components/MyOrdersPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

function MyOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isAuthenticated, authLoading } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            if (!authLoading && !isAuthenticated) {
                navigate('/login');
                return;
            }
            if (authLoading) return; // Wait for auth status to be confirmed

            try {
                const response = await axios.get('/api/orders');
                setOrders(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching orders:", err);
                setError('Failed to fetch orders. ' + (err.response ? err.response.data.message : err.message));
                setLoading(false);
            }
        };

        fetchOrders();
    }, [isAuthenticated, authLoading, navigate]);

    if (loading || authLoading) {
        return <div className="text-center mt-5">Loading orders...</div>;
    }

    if (error) {
        return <div className="alert alert-danger mt-5">{error}</div>;
    }

    if (!isAuthenticated) {
        return null; // Redirect handled by useEffect
    }

    if (orders.length === 0) {
        return <div className="alert alert-info mt-5 text-center">You have no past orders.</div>;
    }

    return (
        <div className="container mt-4">
            <h1>My Orders</h1>
            {orders.map(order => (
                <div key={order.id} className="card mb-3">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        Order ID: <strong>#{order.id}</strong>
                        <span>Status: <span className={`badge bg-${order.status === 'completed' ? 'success' : order.status === 'cancelled' ? 'danger' : 'warning'}`}>{order.status}</span></span>
                    </div>
                    <div className="card-body">
                        <p className="card-text">Total: <strong>${parseFloat(order.total_amount).toFixed(2)}</strong></p>
                        <p className="card-text">Date: {new Date(order.created_at).toLocaleString()}</p>
                        <h6>Items:</h6>
                        <ul className="list-group list-group-flush">
                            {order.items.map(item => (
                                <li key={item.id} className="list-group-item">
                                    {item.quantity} x {item.product.name} (${parseFloat(item.price_at_purchase).toFixed(2)} each)
                                </li>
                            ))}
                        </ul>
                        <Link to={`/orders/${order.id}`} className="btn btn-sm btn-outline-primary mt-3">View Details</Link>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default MyOrdersPage;