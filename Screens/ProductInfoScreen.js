import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  Dimensions,
  ScrollView,
  FlatList,
  ImageBackground,
  TextInput,
} from 'react-native';
import {useRoute} from '@react-navigation/native'; // Import useRoute
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useCart} from '../Context/CartContext';
import { useNavigation } from '@react-navigation/native';

export default function ProductInfoScreen() {
  const route = useRoute();
  const {width, height} = Dimensions.get('window');
  const [addedToCart, setAddedToCart] = useState(false);
  const {cart, setCart} = useCart();
  const navigation=useNavigation()

  // Item will be the product information passed via route.params
  const item = route.params; // Access product data passed through the route

  const addToCart = async () => {
    try {
      // Add the current item to the cart
      const updatedCart = [...cart, item];
      setCart(updatedCart);

      // Save the updated cart to AsyncStorage
      await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
      console.log('Item added to cart:', item);
      setAddedToCart(true); // Set addedToCart state to true
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };


  const handleAddToCart = () => {
    addToCart(); // Call the addToCart function
    setAddedToCart(true); // Set state to true to show "Go to Cart"
    setTimeout(() => {
      setAddedToCart(false); // Revert back to "Add to Cart" after 10 seconds
    }, 10000); // 10 seconds in milliseconds
  };

  return (
    <ScrollView style={{backgroundColor: 'white'}}>
      <View
        style={{
          backgroundColor: '#F5C469',
          flexDirection: 'row',
          alignItems: 'center',
          paddingEnd: 5,
        }}>
        <Pressable
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'white',
            borderRadius: 6,
            paddingHorizontal: 20,
            marginBottom: 20,
            margin: 20,
            gap: 3,
            width: 355,
            height: 38,
          }}>
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/128/3031/3031293.png',
            }}
            style={{width: 24, height: 24}}
          />
          <TextInput
            style={{
              height: 38,
              flex: 1,
              textDecorationColor: 'black',
              color: 'red',
            }}
            placeholder="Search in Trendify"
            placeholderTextColor="black"
          />
        </Pressable>
        <Image
          source={{
            uri: 'https://cdn-icons-png.flaticon.com/128/709/709950.png',
          }}
          style={{width: 30, height: 30}}
        />
      </View>
      <View style={{marginTop: 25}}>
        <FlatList
          data={route.params.carouselImages}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({item}) => (
            <ImageBackground
              style={{height: 300, width}}
              source={{uri: item}}
              resizeMode="contain">
              <View
                style={{
                  padding: 20,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                {/* First Circle with Text */}
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: '#C60C30',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      textAlign: 'center',
                      fontWeight: '600',
                      fontSize: 12,
                    }}>
                    20% Off
                  </Text>
                </View>

                {/* Second Circle with Image */}
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: '#E0E0E0',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image
                    style={{height: 24, width: 24}}
                    source={{
                      uri: 'https://cdn-icons-png.flaticon.com/128/929/929539.png',
                    }}
                  />
                </View>
              </View>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: '#E0E0E0',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                  marginTop: 'auto',
                  marginLeft: 20,
                  marginBottom: 20,
                }}>
                <Image
                  style={{height: 24, width: 24}}
                  source={{
                    uri: 'https://cdn-icons-png.flaticon.com/128/151/151910.png',
                  }}
                />
              </View>
            </ImageBackground>
          )}
        />
      </View>

      <View style={{padding: 10}}>
        <Text style={{fontSize: 15, fontWeight: '500'}}>
          {route.params.title}
        </Text>
        <Text style={{fontSize: 15, fontWeight: '600', paddingTop: 5}}>
          ₹ {route.params.price}
        </Text>
      </View>
      <Text style={{height: 1, borderColor: '#D0D0D0', borderWidth: 1}} />
      <View style={{flexDirection: 'row', alignItems: 'center', padding: 10}}>
        <Text>Color: </Text>
        <Text style={{fontSize: 15, fontWeight: 'bold'}}>
          {route?.params?.color}
        </Text>
      </View>

      <View style={{flexDirection: 'row', alignItems: 'center', padding: 10}}>
        <Text>Size: </Text>
        <Text style={{fontSize: 15, fontWeight: 'bold'}}>
          {route?.params?.size}
        </Text>
      </View>

      <Text style={{height: 1, borderColor: '#D0D0D0', borderWidth: 1}} />
      <View style={{padding: 10}}>
        <Text style={{fontSize: 15, fontWeight: 'bold', marginVertical: 5}}>
          Total : ₹{route.params.price}
        </Text>
        <Text style={{color: '#00CED1'}}>
          FREE delivery Tomorrow by 3 PM.Order within 10hrs 30 mins
        </Text>

        <View
          style={{
            flexDirection: 'row',
            marginVertical: 5,
            alignItems: 'center',
            gap: 5,
          }}>
          <Image
            style={{height: 24, width: 24}}
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/128/3177/3177361.png',
            }}
          />

          <Text style={{fontSize: 15, fontWeight: '500'}}>
            Deliver To Kapil - Bangalore 560019
          </Text>
        </View>
      </View>

      <Text style={{color: 'green', marginHorizontal: 10, fontWeight: '500'}}>
        IN Stock
      </Text>
      <Pressable
        onPress={addedToCart ? () => navigation.navigate('Cart') : handleAddToCart}
        style={{
          backgroundColor: '#FFC72C',
          padding: 10,
          borderRadius: 20,
          justifyContent: 'center',
          alignItems: 'center',
          marginHorizontal: 10,
          marginVertical: 10,
        }}>
        {addedToCart ? (
          <View>
            <Text>Go to Cart </Text>
          </View>
        ) : (
          <View>
            <Text>Add to Cart </Text>
          </View>
        )}
      </Pressable>

      <Pressable
       onPress={()=>{
        navigation.navigate('Cart')
         addToCart()}}
        style={{
          backgroundColor: '#FFAC1C',
          padding: 10,
          borderRadius: 20,
          justifyContent: 'center',
          alignItems: 'center',
          marginHorizontal: 10,
          marginVertical: 10,
        }}>
        <Text>Buy Now</Text>
      </Pressable>
    </ScrollView>
  );
}
