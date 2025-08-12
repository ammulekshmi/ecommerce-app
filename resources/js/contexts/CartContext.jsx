import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext'; // We'll create AuthContext next

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState({ items: [], cart_total: 0 });
    const [cartLoading, setCartLoading] = useState(true);
    const [cartError, setCartError] = useState(null);
    const { isAuthenticated } = useContext(AuthContext); // Use auth status

    // Function to fetch the cart
    const fetchCart = async () => {
        setCartLoading(true);
        try {
            const response = await axios.get('/api/cart');
            setCart(response.data);
        } catch (err) {
            console.error("Error fetching cart:", err);
            setCartError("Failed to load cart.");
            setCart({ items: [], cart_total: 0 }); // Clear cart on error
        } finally {
            setCartLoading(false);
        }
    };

    // Fetch cart on initial load and when auth status changes
    useEffect(() => {
        fetchCart();
    }, [isAuthenticated]); // Refetch cart when user logs in/out

    const addToCart = async (productId, quantity = 1) => {
        try {
            const response = await axios.post('/api/cart', {
                product_id: productId,
                quantity: quantity
            });
            // After adding, refetch the entire cart to get the latest state
            await fetchCart();
            return { success: true, message: response.data.message };
        } catch (err) {
            console.error("Error adding to cart:", err);
            return { success: false, message: err.response?.data?.message || 'Failed to add to cart.' };
        }
    };

    const updateCartItemQuantity = async (cartItemId, newQuantity) => {
        try {
            const response = await axios.put(`/api/cart/${cartItemId}`, {
                quantity: newQuantity
            });
            await fetchCart(); // Refetch cart to update total and items
            return { success: true, message: response.data.message };
        } catch (err) {
            console.error("Error updating cart item:", err);
            return { success: false, message: err.response?.data?.message || 'Failed to update cart item.' };
        }
    };

    const removeCartItem = async (cartItemId) => {
        try {
            const response = await axios.delete(`/api/cart/${cartItemId}`);
            await fetchCart(); // Refetch cart
            return { success: true, message: response.data.message };
        } catch (err) {
            console.error("Error removing cart item:", err);
            return { success: false, message: err.response?.data?.message || 'Failed to remove item.' };
        }
    };

    const clearCart = async () => {
        // This is more complex as you need to delete all items individually
        // or add a backend endpoint to clear the whole cart.
        // For now, after checkout, we can rely on the backend to clear the cart.
        // A simpler approach for UI is just to reset local state after a successful checkout.
        setCart({ items: [], cart_total: 0 });
    };

    return (
        <CartContext.Provider value={{
            cart,
            cartLoading,
            cartError,
            addToCart,
            updateCartItemQuantity,
            removeCartItem,
            fetchCart, // Expose fetchCart for manual refresh if needed
            clearCart // Expose clearCart for use after checkout
        }}>
            {children}
        </CartContext.Provider>
    );
};