import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useState, useEffect } from "react";

// Create the context
const CartContext = createContext();

// Define the provider component
const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    // Load cart data from AsyncStorage on component mount
    useEffect(() => {
        const loadCart = async () => {
            try {
                const existingCartItem = await AsyncStorage.getItem("cart");
                if (existingCartItem) {
                    setCart(JSON.parse(existingCartItem));
                }
            } catch (error) {
                console.error("Failed to load cart data from AsyncStorage:", error);
            }
        };

        loadCart();
    }, []);

    // Update AsyncStorage whenever the cart changes
    useEffect(() => {
        const saveCart = async () => {
            try {
                await AsyncStorage.setItem("cart", JSON.stringify(cart));
            } catch (error) {
                console.error("Failed to save cart data to AsyncStorage:", error);
            }
        };

        if (cart) saveCart();
    }, [cart]);

    return (
        <CartContext.Provider value={{ cart, setCart }}>
            {children}
        </CartContext.Provider>
    );
};

// Custom hook to use the CartContext
const useCart = () => useContext(CartContext);

export { useCart, CartProvider };
