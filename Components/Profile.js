import { StyleSheet, Text, View, Pressable, Alert, ScrollView,Image,SafeAreaView } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

export default function Profile() {
  const [user, setUser] = useState(null);  // State to store user data
  const navigation = useNavigation();

  // Log out the user by clearing the token
  const logout = async () => {
    await clearAuthToken();
  };

  // Function to clear auth token
  const clearAuthToken = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('email');
      await AsyncStorage.removeItem('cart');
      console.log('Auth token cleared');
      navigation.replace('Login');
    } catch (error) {
      console.error('Error clearing auth token:', error);
    }
  };

  // Function to fetch the user ID based on email
  const fetchUserId = async (email) => {
    try {
      const res = await axios.get('http://192.168.174.10:8000/get-user', {
        params: { email },  // Pass email as query parameter
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('data', res.data);
      return res.data;  // Return the userId from the response
    } catch (error) {
      console.error('Error fetching user ID:', error);
    }
  };

  // Fetch user profile from the backend
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const useremail = await AsyncStorage.getItem('email');  // Get email from AsyncStorage
        console.log('useremail', useremail);

        if (useremail) {
          const userId = await fetchUserId(useremail);  // Wait for userId
          const response = await axios.get(`http://192.168.174.10:8000/profile?userId=${userId}`, {
            headers: {
              'Content-Type': 'application/json',
            },
          });

          console.log(response.data);  // Check user data in console
          setUser(response.data);  // Set the fetched user data
        } else {
          Alert.alert('Error', 'Email not found in storage.');
        }
      } catch (error) {
        console.log('Error fetching user profile:', error);
        Alert.alert('Error', 'Failed to fetch user data.');
      }
    };

    fetchUserProfile();
  }, []);  // Empty dependency array to ensure it runs only once

  // Conditional rendering based on whether user data is available
  if (user === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading user data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, padding: 20, }}>
    <SafeAreaView style={{ flex: 1, alignItems: 'center' }}>
       <View> 
              <Image
                style={{width: 150, height: 100, marginTop: 50,resizeMode:'contain',}}
                source={{
                  uri: 'https://assets.stickpng.com/thumbs/5f44f3e6acda2c000402a6ee.png',
                }}
              />
            </View>
      <Text style={{ marginTop: 20, textAlign: 'center', fontSize: 20 }}>
        Welcome to Trendify, {user.name || 'Guest'}!
      </Text>

      {/* Display user data */}
      <Text style={{ fontSize: 16, marginTop: 40 }}>
        Email: {user.email}{''}
      </Text>
      <Text style={{ fontSize: 16, marginTop: 30 }}>
        Password: {user.password}{' '}
      </Text>
      <Text style={{ fontSize: 16, marginTop: 30 }}>
        Registered At: {new Date(user.createdAt).toLocaleDateString()}{'  '}
      </Text>

      

      <View style={{ marginTop: 80 }}>
        <Pressable
          onPress={logout}
          style={{
            backgroundColor: '#F3B431',
            width: 200,
            borderRadius: 6,
            marginLeft: 'auto',
            marginRight: 'auto',
            padding: 8,
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>
            Log out
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
