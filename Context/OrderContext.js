import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useState, useEffect } from "react";

// Create the context
const OrderContext = createContext();

// Define the provider component
const OrderProvider = ({ children }) => {
    const [order, setOrder] = useState([]);

    // Load cart data from AsyncStorage on component mount
    useEffect(() => {
        const loadOrder = async () => {
            try {
                const existingCartItem = await AsyncStorage.getItem("order");
                if (existingCartItem) {
                    setOrder(JSON.parse(existingCartItem));
                }
            } catch (error) {
                console.error("Failed to load cart data from AsyncStorage:", error);
            }
        };

        loadOrder();
    }, []);

    // Update AsyncStorage whenever the cart changes
    useEffect(() => {
        const saveOrder = async () => {
            try {
                await AsyncStorage.setItem("order", JSON.stringify(cart));
            } catch (error) {
                console.error("Failed to save cart data to AsyncStorage:", error);
            }
        };

        if (order) saveOrder();
    }, [order]);

    return (
        <OrderContext.Provider value={{ order, setOrder }}>
            {children}
        </OrderContext.Provider>
    );
};

// Custom hook to use the CartContext
const useOrder = () => useContext(OrderContext);

export { useOrder, OrderProvider };
