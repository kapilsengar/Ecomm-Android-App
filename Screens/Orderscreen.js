import { StyleSheet, Text, View, ScrollView, Alert, Pressable, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function Orderscreen() {
  const [orders, setOrders] = useState([]); // Initialize orders as an array
  const [loading, setLoading] = useState(true); // Loading state

  // Function to fetch userId using the email from the database
  const fetchUserId = async (email) => {
    try {
      const res = await axios.get('http://192.168.174.10:8000/get-user', {
        params: { email },  // Pass email as query parameter
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return res.data;  // Return the userId from the response
    } catch (error) {
      console.error('Error fetching user ID:', error);
      throw new Error('Failed to fetch user ID');
    }
  };

  useEffect(() => {
    const fetchUserOrders = async () => {
        try {
            const useremail = await AsyncStorage.getItem('email');  // Get email from AsyncStorage
            console.log('useremail', useremail);

            if (useremail) {
                const userId = await fetchUserId(useremail);  // Wait for userId
                console.log("userId:", userId);

                // Fetch orders for this userId
                const response = await axios.get(`http://192.168.174.10:8000/orders?userId=${userId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                console.log("Orders fetched:", response.data);

                // Check if orders data is an array
                if (Array.isArray(response.data)) {
                    setOrders(response.data);
                } else {
                    console.log("No orders found");
                    setOrders([]); // Clear orders if not an array
                }
            } else {
                console.log("User email not found");
            }
        } catch (error) {
            console.log('Error fetching orders:', error);
            Alert.alert('Error', `Failed to fetch order data: ${error.message}`);
        }
    };

    fetchUserOrders();
}, []);


  
    return (
      <ScrollView>
        <View style={{ borderColor: 'black', borderWidth: 1, padding: 4,backgroundColor:'white' }}>
          <Text style={{ fontSize: 30, textAlign: 'center', padding: 10 }}>Your Orders</Text>
        </View>
    
        {/* Check if orders is an array before calling map */}
        {Array.isArray(orders) && orders.length > 0 ? (
          orders.map((order) => (
            <Pressable
              style={{
                marginTop: 20,
                padding: 15,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: '#d0d0d0',
                marginHorizontal: 10,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor:'white'
              }}
              key={order._id}
            >
             
              <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>
                Order ID: {order._id}{' '}
              </Text>
            
             
              {order.products.map((product) => (
                <View style={{ marginVertical: 10 ,flexDirection:'row',justifyContent:'space-evenly',alignItems:'center'}} key={product._id}>
                  <Image
                    source={{ uri: product.image }}
                    style={{ width: 60, height: 60, resizeMode: 'contain' }}
                  />
                  <View style={{flex:1}}>
                  <Text style={{width:150,marginLeft:20}} numberOfLines={2} ellipsizeMode='tail'>{product.name}{' '}</Text>
                  <Text style={{width:150,marginLeft:20}} numberOfLines={2} ellipsizeMode='tail'>item:{product.quantity}{' '}</Text>
                 
                  
                  
                  </View>

                  
                </View>
              ))}
              <View style={{flexDirection:'row'}}>

               <Text style={{width:150,marginLeft:20}} numberOfLines={2} ellipsizeMode='tail'>Date:{new Date(order.createdAt).toLocaleDateString()}{' '}</Text>
              <Text style={{width:150,marginLeft:20}} numberOfLines={2} ellipsizeMode='tail'>Total Amount :₹{order.totalPrice}{' '}</Text>
              </View>
            </Pressable>
          ))
        ) : (
          <Text style={{textAlign:'center',justifyContent:'center',marginTop:40 ,fontSize:15}}>No orders available Please Make a Order</Text>
        )}
      </ScrollView>
    );
    
}

const styles = StyleSheet.create({});
