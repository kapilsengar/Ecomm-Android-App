import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Image,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCart } from '../Context/CartContext';


const CartScreen = () => {
  const { cart, setCart } = useCart();
  
 
  const updateCart = async (updatedCart) => {
    setCart(updatedCart);
    try {
      await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
    } catch (error) {
      Alert.alert('Error', 'Failed to save cart data. Please try again.');
    }
  };
  //  const quantity=1

 

  const handleDecrease = (item) => {
    const updatedCart = cart.map((cartItem) =>
      cartItem.title === item.title && (cartItem.quantity || 1) > 1
        ? { ...cartItem, quantity: (cartItem.quantity || 1) - 1 }
        : cartItem
    );
    updateCart(updatedCart);
  };
  const handleIncrease = (item) => {
    const updatedCart = cart.map((cartItem) =>
      cartItem.title === item.title
        ? { ...cartItem, quantity: (cartItem.quantity || 1) + 1 }
        
        : cartItem
    );
    updateCart(updatedCart);
  };

  const removeItem = (itemToRemove) => {
    const updatedCart = cart.filter(item => item.title !== itemToRemove.title);
    updateCart(updatedCart);
  };
 
  const totalPrice = () => {
    try {
      let total = 0;
      cart?.forEach((item) => {
        total += item.price * (item.quantity || 1); // Use item.quantity or default to 1
      });
      return total.toLocaleString(); // Format the total price
    } catch (error) {
      console.log("Error calculating total price:", error);
      return 0; // Return 0 if an error occurs
    }
  };
  

  if (cart.length === 0) {
    return (
      <View style={styles.emptyCart}>
        <Text style={{ fontSize: 18 }}>Your cart is empty!</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={styles.header}>
        <Text style={{ fontSize: 18, fontWeight: '400' }}>Subtotal: </Text>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>₹{totalPrice()}</Text>
      </View>
      <Text style={{ marginHorizontal: 10 }}>EMI details Available</Text>

      <Pressable style={styles.buyButton}>
        <Text>Proceed to Buy ({cart.length}) items</Text>
      </Pressable>

      <Text style={styles.separator} />

      <View style={{ marginHorizontal: 10 }}>
      {Array.isArray(cart) && cart.length > 0 ? (
  cart.map((item, index) => (
    <View style={styles.cartItem} key={index}>
      <Pressable style={styles.itemDetails}>
        <Image style={styles.itemImage} source={{ uri: item?.image }} />
        <View>
          <Text numberOfLines={3} style={styles.itemTitle}>{item?.title}</Text>
          <Text style={styles.itemPrice}>₹{item?.price}</Text>
          <Text style={{ color: 'green' }}>In Stock</Text>
        </View>
      </Pressable>

      <View style={styles.itemActions}>
        <View style={styles.quantityControl}>
          <Pressable onPress={() => handleDecrease(item)} style={styles.decrementButton}>
            <Text style={{ fontSize: 24 }}>-</Text>
          </Pressable>
          <Text style={styles.quantityText}>{item.quantity || 1}</Text>
          <Pressable onPress={() => handleIncrease(item)} style={styles.incrementButton}>
            <Text style={{ fontSize: 24 }}>+</Text>
          </Pressable>
        </View>
        <Pressable onPress={() => removeItem(item)} style={styles.deleteButton}>
          <Text>Delete</Text>
        </Pressable>
      </View>
    </View>
  ))
) : (
  <Text>No items in the cart</Text>
)}

      </View>
    </ScrollView>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  emptyCart: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { padding: 10, flexDirection: 'row', alignItems: 'center' },
  buyButton: {
    backgroundColor: '#FFC72C',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    marginTop: 10,
  },
  separator: {
    height: 1,
    borderColor: '#D0D0D0',
    borderWidth: 1,
    marginTop: 16,
  },
  cartItem: {
    backgroundColor: 'white',
    marginVertical: 10,
    borderBottomColor: '#F0F0F0',
    borderBottomWidth: 2,
  },
  itemDetails: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 },
  itemImage: { width: 140, height: 140, resizeMode: 'contain' },
  itemTitle: { width: 150, marginTop: 10 },
  itemPrice: { fontSize: 20, fontWeight: 'bold', marginTop: 6 },
  itemActions: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 10 },
  quantityControl: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  decrementButton: { backgroundColor: '#D8D8D8', padding: 7 },
  incrementButton: { backgroundColor: '#D8D8D8', padding: 7 },
  quantityText: { paddingHorizontal: 18 },
  deleteButton: { backgroundColor: 'white', paddingHorizontal: 8, borderWidth: 0.6 },
});