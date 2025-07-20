// resources/js/App.jsx (Note: changed from .js to .jsx)
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// --- Component Imports ---
// Make sure these paths are correct relative to THIS App.jsx file
// E.g., if Home.jsx is in the SAME folder, it's './Home'.
// If Auth components are in a subfolder, it's './Auth/Login', etc.

import Home from './Home';
import Products from './Products';
import Categories from './Categories';
import Cart from './Cart';
import Orders from './Orders';
import NotFound from './NotFound';
import Login from './Auth/Login'; // Assuming you'll move auth into React later
import Register from './Auth/Register';

function App() {
    return (
        <Router>
            {/* --- Navbar --- */}
            {/* Added standard Bootstrap 5 classes for responsiveness and collapse toggle */}
            <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
                <div className="container">
                    <Link className="navbar-brand" to="/">E-commerce App</Link>
                    {/* Bootstrap 5 Toggler for responsive navigation */}
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto"> {/* ms-auto pushes items to the right */}
                            <li className="nav-item">
                                <Link className="nav-link" to="/">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/products">Products</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/categories">Categories</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/cart">Cart</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/orders">Orders</Link>
                            </li>
                            {/* --- Authentication Links --- */}
                            {/*
                                You might want to conditional render these based on user login status.
                                For now, they're fine as placeholders.
                            */}
                            <li className="nav-item">
                                <Link className="nav-link" to="/login">Login</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/register">Register</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* --- Main Content Area and Routes --- */}
            <div className="container mt-4"> {/* Bootstrap container for content, mt-4 for top margin */}
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    {/*
                        Optional: Add a catch-all route for 404 Not Found pages.
                        This should be the last Route in your Routes block.
                        Example: <Route path="*" element={<NotFound />} />
                        You'd need to create a NotFound.jsx component.
                    */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;