// AuthContext to manage user login status and use it to conditionally render navigation links.
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [authError, setAuthError] = useState(null);

    // Function to check authentication status
    const checkAuthStatus = async () => {
        const token = localStorage.getItem('authToken');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            try {
                const response = await axios.get('/api/user'); // Endpoint that returns current user
                setUser(response.data);
                setIsAuthenticated(true);
            } catch (err) {
                console.error("Authentication check failed:", err);
                localStorage.removeItem('authToken'); // Token might be invalid
                setIsAuthenticated(false);
                setUser(null);
                setAuthError("Session expired or invalid. Please log in again.");
            }
        } else {
            setIsAuthenticated(false);
            setUser(null);
        }
        setAuthLoading(false);
    };

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const login = async (credentials) => {
        setAuthLoading(true);
        try {
            const response = await axios.post('/api/login', credentials);
            localStorage.setItem('authToken', response.data.token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
            await checkAuthStatus(); // Fetch user data after login
            return { success: true, message: 'Logged in successfully!' };
        } catch (err) {
            console.error("Login failed:", err);
            setIsAuthenticated(false);
            setUser(null);
            const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
            setAuthError(errorMessage);
            return { success: false, message: errorMessage };
        } finally {
            setAuthLoading(false);
        }
    };

    const register = async (userData) => {
        setAuthLoading(true);
        try {
            const response = await axios.post('/api/register', userData);
            localStorage.setItem('authToken', response.data.token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
            await checkAuthStatus(); // Fetch user data after registration
            return { success: true, message: 'Registration successful! You are now logged in.' };
        } catch (err) {
            console.error("Registration failed:", err);
            setIsAuthenticated(false);
            setUser(null);
            const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
            setAuthError(errorMessage);
            return { success: false, message: errorMessage };
        } finally {
            setAuthLoading(false);
        }
    };

    const logout = async () => {
        setAuthLoading(true);
        try {
            await axios.post('/api/logout');
            localStorage.removeItem('authToken');
            delete axios.defaults.headers.common['Authorization'];
            setIsAuthenticated(false);
            setUser(null);
            setAuthError(null);
            return { success: true, message: 'Logged out successfully!' };
        } catch (err) {
            console.error("Logout failed:", err);
            // Even if logout fails on server, clear local state for UX
            localStorage.removeItem('authToken');
            delete axios.defaults.headers.common['Authorization'];
            setIsAuthenticated(false);
            setUser(null);
            setAuthError("Logout failed on server, but you are logged out locally.");
            return { success: false, message: 'Logout failed.' };
        } finally {
            setAuthLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            user,
            authLoading,
            authError,
            login,
            register,
            logout,
            checkAuthStatus // Expose for other contexts/components to use
        }}>
            {children}
        </AuthContext.Provider>
    );
};