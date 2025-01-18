import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from 'react-native';
import React, {useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useCart} from '../Context/CartContext';

export default function ProductItems({item}) {
  const [addedToCart, setAddedToCart] = useState(false);
  const {cart, setCart} = useCart();

  const {width} = Dimensions.get('window');
  const addToCart = async () => {
    try {
      // Ensure cart is initialized as an array
      const existingCart = Array.isArray(cart) ? cart : [];

      // Add the current item to the cart
      const updatedCart = [...existingCart, item];
      setCart(updatedCart);

      // Save the updated cart to AsyncStorage
      await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
      setAddedToCart(true);
      console.log('Item added to cart:', item);
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  return (
    <Pressable style={{marginHorizontal: 25, marginVertical: 25}}>
      <Image
        style={{width: 150, height: 150, resizeMode: 'contain'}}
        source={{uri: item.image}}
      />
      <Text numberOfLines={1} style={{width: 150}}>
        {item?.title}
      </Text>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 5,
        }}>
        <Text style={{fontSize: 15, fontWeight: 'bold'}}>₹{item?.price}</Text>
        <Text style={{color: '#DFAF2B', fontWeight: '500'}}>
          {item?.rating.rate} rating
        </Text>
      </View>

      <Pressable
        style={{
          backgroundColor: '#F3B431',
          paddingVertical: 10, // Increased padding for better spacing
          paddingHorizontal: 20, // Fixed padding instead of dynamic for consistency
          borderRadius: 20,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 10,
        }}
        onPress={addToCart}>
        {addedToCart ? (
          <View>
            <Text
              style={{
                fontSize: 14,
                color: '#000',
              }}>
              Go to Cart{' '}
            </Text>
          </View>
        ) : (
          <Text
            style={{
              fontSize: 14,
              color: '#000',
              borderColor: 'black',
            }}>
            Add to Cart{' '}
          </Text>
        )}
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({});
