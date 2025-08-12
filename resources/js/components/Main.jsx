// resources/js/Main.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// --- Component Imports ---
import Products from './Products';
import Categories from './Categories';
import Login from './Auth/Login'; 
import Register from './Auth/Register';

// --- New Components & Contexts ---
import Navbar from './Navbar'; // New Navbar component
import CartPage from './CartPage';
import CheckoutPage from './CheckoutPage'; // Check the relative path here
import MyOrdersPage from './MyOrdersPage';
import OrderDetailPage from './OrderDetailPage';

// --- Context Imports ---
import { AuthProvider } from '../contexts/AuthContext';
import { CartProvider } from '../contexts/CartContext';


function Main() {
    return (
        <Router>
            <AuthProvider>
                <CartProvider>
                    {/* The Navbar component is placed outside the Routes block
                        so it's visible on every page. */}
                    <Navbar />
                    
                    {/* Main content will be rendered inside this container */}
                    <div className="container mt-4">
                        <Routes>
                            <Route path="/" element={<Products />} />
                            <Route path="/products" element={<Products />} />
                            <Route path="/categories" element={<Categories />} />
                            <Route path="/cart" element={<CartPage />} />
                            <Route path="/checkout" element={<CheckoutPage />} />
                            <Route path="/orders" element={<MyOrdersPage />} />
                            <Route path="/orders/:id" element={<OrderDetailPage />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            {/* You can add a 404 Not Found route here */}
                            {/* <Route path="*" element={<NotFound />} /> */}
                        </Routes>
                    </div>
                </CartProvider>
            </AuthProvider>
        </Router>
    );
}

export default Main;