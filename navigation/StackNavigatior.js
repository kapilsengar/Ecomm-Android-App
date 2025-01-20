import {StyleSheet, Text, View,Image} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import LoginScreen from '../Screens/LoginScreen';
import SignUpScreen from '../Screens/SignUpScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../Screens/HomeScreen';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import ProductInfoScreen from '../Screens/ProductInfoScreen';
import Profile from '../Components/Profile';
import CartScreen from '../Screens/CartScreen';
import Orderscreen from '../Screens/Orderscreen';
import AddAddressScreen from '../Screens/AddAddressScreen';
import AddressScreen from '../Screens/AddressScreen';
import ConfirmationScreen from '../Screens/ConfirmationScreen';
import PlaceOrderScreen from '../Screens/PlaceOrderScreen';




export default function StackNavigatior() {
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();
  function BottomTabs() { 
    return (
      <Tab.Navigator>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: 'Home',
            tabBarLabelStyle: {color: '#008E97'},
            headerShown: false,
            tabBarIcon: ({focused}) => (  
              <Image
                source={
                  focused?{uri:'https://cdn-icons-png.flaticon.com/128/1946/1946436.png'}
                 : {uri: 'https://cdn-icons-png.flaticon.com/128/1946/1946488.png'}
                  }          // Replace with your image URL or local image
                style={{width: 24, height: 24}}
              />
            )
          }}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            tabBarLabel: 'Profile',
            tabBarLabelStyle: {color: '#008E97'},
            headerShown: false,
            tabBarIcon: ({focused}) => (  
              <Image
                source={
                  focused?{uri:'https://cdn-icons-png.flaticon.com/128/456/456212.png'}
                 : {uri: 'https://cdn-icons-png.flaticon.com/128/456/456283.png'}
                  }          // Replace with your image URL or local image
                style={{width: 24, height: 24}}
              />
            )
          }}
        />
        <Tab.Screen
          name="Cart"
          component={CartScreen}
          options={{
            tabBarLabel: 'Cart',
            tabBarLabelStyle: {color: '#008E97'},
            headerShown: false,
            tabBarIcon: ({focused}) => (  
              <Image
                source={
                  focused?{uri:'https://cdn-icons-png.flaticon.com/128/15737/15737380.png'}
                 : {uri: 'https://cdn-icons-png.flaticon.com/128/2838/2838895.png'}
                  }          // Replace with your image URL or local image
                style={{width: 24, height: 24}}
              />
            )
          }}
        />
        <Tab.Screen
          name="Order"
          component={Orderscreen}
          options={{
            tabBarLabel: 'Order',
            tabBarLabelStyle: {color: '#008E97'},
            headerShown: false,
            tabBarIcon: ({focused}) => (  
              <Image
                source={
                  focused?{uri:'https://cdn-icons-png.flaticon.com/128/1007/1007959.png'}
                 : {uri: 'https://cdn-icons-png.flaticon.com/128/1008/1008010.png'}
                  }          // Replace with your image URL or local image
                style={{width: 24, height: 24}}
              />
            )
          }}
        />
       
        

        
      </Tab.Navigator>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Register"
          component={SignUpScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Main"
          component={BottomTabs}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ProductInfo"
          component={ProductInfoScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Cart"
          component={CartScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Address"
          component={AddAddressScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Add"
          component={AddressScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Confirm"
          component={ConfirmationScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="PlaceOrder"
          component={PlaceOrderScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});
