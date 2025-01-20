import {Pressable, StyleSheet, Text, View, Image} from 'react-native';
import React, {useState, useEffect} from 'react';
import {ScrollView} from 'react-native-virtualized-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useCart } from '../Context/CartContext';
import { useNavigation } from "@react-navigation/native";
export default function ConfirmationScreen() {
  const steps = [
    {title: 'Address', content: 'Address Form'},
    {title: 'Delivery', content: 'Delivery Options'},
    {title: 'Payment', content: 'Payment Details'},
    {title: 'Place Order', content: 'Order Summary'},
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddresses] = useState('');
  const [option, setOption] = useState(false);
  const [selectedOption, setSelectedOption] = useState(false);
  const { cart, setCart } = useCart();
const navigation = useNavigation();

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        console.log('Fetching addresses...');

        // Retrieve user email
        const useremail = await AsyncStorage.getItem('email');
        if (!useremail) {
          console.error('No email found.');
          return;
        }
        console.log('Retrieved email:', useremail);

        // Fetch addresses
        const response = await axios.get('http://192.168.174.10:8000/addresses', {
          headers: {'Content-Type': 'application/json'},
          params: {useremail},
        });

        console.log('Addresses fetched successfully:', response.data);
        setAddresses(response.data);
      } catch (err) {
        console.error('Error fetching addresses:', err.message || err);
      }
    };

    fetchAddresses();
  }, []);

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


  const handlePlaceOrder = async () => {
    try {
      // Get user email from AsyncStorage
      const useremail = await AsyncStorage.getItem('email');
      if (!useremail) {
        console.error('User email not found.');
        return;
      }
  
      // Convert totalPrice to a number without commas
      const formattedTotalPrice = parseFloat(totalPrice().replace(/,/g, ''));
  
      // Prepare order data
      const orderData = {
        useremail,
        cartItems: cart,
        totalPrice: formattedTotalPrice, // Ensure it is a valid number
        shippingAddress: selectedAddress,
        paymentMethod: selectedOption,
      };
  
      console.log('Order Data:', orderData);
  
      // Send POST request to create the order
      const response = await axios.post(
        'http://192.168.174.10:8000/orders',
        orderData,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
  
      if (response.status === 200) {
        console.log('Order created successfully:', response.data);
       
       setCart([])
        navigation.navigate('PlaceOrder');
      } else {
        console.error('Error creating order:', response.data);
      }
    } catch (error) {
      console.error('Error placing order:', error.response?.data || error.message || error);
    }
  };
  
  

  return (
    <ScrollView>
      <View style={{paddingHorizontal: 20, paddingTop: 40}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
          }}>
          {steps.map((step, index) => (
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              {index > 0 && (
                <View
                  style={[
                    {flex: 1, height: 2, backgroundColor: 'green'},
                    index <= currentStep && {backgroundColor: 'green'},
                  ]}
                />
              )}

              <View
                style={[
                  {
                    width: 30,
                    height: 30,
                    borderRadius: 15,
                    backgroundColor: '#ccc',
                    justifyContent: 'center',
                    alignItems: 'center',
                  },
                ]}>
                <View
                  style={[
                    {
                      width: 30,
                      height: 30,
                      borderRadius: 15,
                      backgroundColor: '#ccc',
                      justifyContent: 'center',
                      alignItems: 'center',
                    },
                    index < currentStep && {backgroundColor: 'green'},
                  ]}>
                  {index < currentStep ? (
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: 'white',
                      }}>
                      &#10003;
                    </Text>
                  ) : (
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: 'white',
                      }}>
                      {index + 1}{' '}
                    </Text>
                  )}
                </View>
              </View>

              <Text style={{textAlign: 'center', marginTop: 8}}>
                {step.title}{' '}
              </Text>
            </View>
          ))}
        </View>
      </View>
      {currentStep == 0 && (
        <View style={{marginHorizontal: 20}}>
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>
            Select Delivery Address{' '}
          </Text>

          {addresses?.map((item, index) => (
            <Pressable
              key={index} // Always include a unique key for each list item
              style={{
                borderWidth: 1,
                borderColor: '#D0D0D0',
                padding: 10,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5,
                paddingBottom: 17,
                marginVertical: 7,
                borderRadius: 6,
              }}>
              {selectedAddress && selectedAddress._id === item?._id ? (
                <Pressable onPress={() => setSelectedAddresses(null)}>
                  <Image
                    style={{height: 24, width: 24}}
                    source={{
                      uri: 'https://cdn-icons-png.flaticon.com/128/5720/5720434.png',
                    }}
                  />
                </Pressable>
              ) : (
                <Pressable onPress={() => setSelectedAddresses(item)}>
                  <Image
                    style={{height: 24, width: 24}}
                    source={{
                      uri: 'https://cdn-icons-png.flaticon.com/128/9742/9742451.png',
                    }}
                  />
                </Pressable>
              )}

              <View style={{marginLeft: 6}}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 3,
                  }}>
                  <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                    {item?.name}
                  </Text>
                </View>

                <Text style={{fontSize: 15, color: '#181818'}}>
                  {item?.houseNo}, {item?.landmark}
                </Text>

                <Text style={{fontSize: 15, color: '#181818'}}>
                  {item?.street}
                </Text>

                <Text style={{fontSize: 15, color: '#181818'}}>
                  India, Bangalore
                </Text>

                <Text style={{fontSize: 15, color: '#181818'}}>
                  phone No : {item?.mobileNo}
                </Text>
                <Text style={{fontSize: 15, color: '#181818'}}>
                  pin code : {item?.postalCode}
                </Text>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                    marginTop: 7,
                  }}>
                  <Pressable
                    style={{
                      backgroundColor: '#F5F5F5',
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      borderRadius: 5,
                      borderWidth: 0.9,
                      borderColor: '#D0D0D0',
                    }}>
                    <Text>Edit{' '}</Text>
                  </Pressable>

                  <Pressable
                    style={{
                      backgroundColor: '#F5F5F5',
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      borderRadius: 5,
                      borderWidth: 0.9,
                      borderColor: '#D0D0D0',
                    }}>
                    <Text>Remove{' '}</Text>
                  </Pressable>

                  <Pressable
                    style={{
                      backgroundColor: '#F5F5F5',
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      borderRadius: 5,
                      borderWidth: 0.9,
                      borderColor: '#D0D0D0',
                    }}>
                    <Text>Set as Default{' '}</Text>
                  </Pressable>
                </View>

                {selectedAddress && selectedAddress._id === item?._id && (
                  <Pressable
                    onPress={() => setCurrentStep(1)}
                    style={{
                      backgroundColor: '#008397',
                      padding: 10,
                      borderRadius: 20,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: 10,
                    }}>
                    <Text style={{textAlign: 'center', color: 'white'}}>
                      Deliver to this Address{' '}
                    </Text>
                  </Pressable>
                )}
              </View>
            </Pressable>
          ))}
        </View>
      )}

      {currentStep == 1 && (
        <View style={{marginHorizontal: 20}}>
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>
            Choose your delivery options{' '}
          </Text>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: 'white',
              padding: 8,
              gap: 7,
              borderColor: '#D0D0D0',
              borderWidth: 1,
              marginTop: 10,
            }}>
            {option ? (
              <Pressable onPress={() => setOption(null)}>
                <Image
                  style={{height: 24, width: 24}}
                  source={{
                    uri: 'https://cdn-icons-png.flaticon.com/128/5720/5720434.png',
                  }}
                />
              </Pressable>
            ) : (
              <Pressable onPress={() => setOption(!option)}>
                <Image
                  style={{height: 24, width: 24}}
                  source={{
                    uri: 'https://cdn-icons-png.flaticon.com/128/9742/9742451.png',
                  }}
                />
              </Pressable>
            )}

            <Text style={{flex: 1}}>
              <Text style={{color: 'green', fontWeight: '500'}}>
                Tomorrow by 10pm{' '}
              </Text>{' '}
              - FREE delivery with your Prime membership{' '}
            </Text>
          </View>

          <Pressable
            onPress={() => setCurrentStep(2)}
            style={{
              backgroundColor: '#FFC72C',
              padding: 10,
              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 15,
            }}>
            <Text>Continue{' '}</Text>
          </Pressable>
        </View>
      )}

{currentStep == 2 && (
        <View style={{ marginHorizontal: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            Select your payment Method{' '}
          </Text>

          <View
            style={{
              backgroundColor: "white",
              padding: 8,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              flexDirection: "row",
              alignItems: "center",
              gap: 7,
              marginTop: 12,
            }}
          >
           
              {selectedOption === "cash" ? (
                <Pressable onPress={() => setOption(null)}>
                  <Image
                    style={{height: 24, width: 24}}
                    source={{
                      uri: 'https://cdn-icons-png.flaticon.com/128/5720/5720434.png',
                    }}
                  />
                </Pressable>
              ) : (
                <Pressable onPress={() => setSelectedOption("cash")}>
                  <Image
                    style={{height: 24, width: 24}}
                    source={{
                      uri: 'https://cdn-icons-png.flaticon.com/128/9742/9742451.png',
                    }}
                  />
                </Pressable>
              )}

            <Text>Cash on Delivery{' '}</Text>
          </View>

          <View
            style={{
              backgroundColor: "white",
              padding: 8,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              flexDirection: "row",
              alignItems: "center",
              gap: 7,
              marginTop: 12,
            }}
          >
            {selectedOption === "card" ? (
                <Pressable onPress={() => setSelectedOption(null)}>
                  <Image
                    style={{height: 24, width: 24}}
                    source={{
                      uri: 'https://cdn-icons-png.flaticon.com/128/5720/5720434.png',
                    }}
                  />
                </Pressable>
              ) : (
                <Pressable onPress={() => setSelectedOption("card")}>
                  <Image
                    style={{height: 24, width: 24}}
                    source={{
                      uri: 'https://cdn-icons-png.flaticon.com/128/9742/9742451.png',
                    }}
                  />
                </Pressable>
              )}

            <Text>UPI / Credit or debit card{' '}</Text>
          </View>
          <Pressable
            onPress={() => setCurrentStep(3)}
            style={{
              backgroundColor: "#FFC72C",
              padding: 10,
              borderRadius: 20,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 15,
            }}
          >
            <Text>Continue{' '}</Text>
          </Pressable>
        </View>
      )}


{currentStep === 3 && selectedOption === "cash" && (
        <View style={{ marginHorizontal: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>Order Now</Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
              backgroundColor: "white",
              padding: 8,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              marginTop: 10,
            }}
          >
            <View>
              <Text style={{ fontSize: 17, fontWeight: "bold" }}>
                Save 5% and never run out{' '}
              </Text>
              <Text style={{ fontSize: 15, color: "gray", marginTop: 5 }}>
                Turn on auto deliveries{' '}
              </Text>
            </View>

            {/* <MaterialIcons
              name="keyboard-arrow-right"
              size={24}
              color="black"
            /> */}
          </View>

          <View
            style={{
              backgroundColor: "white",
              padding: 8,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              marginTop: 10,
            }}
          >
            <Text>Shipping to {selectedAddress?.name}{' '}</Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 8,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "500", color: "gray" }}>
                Items{' '}
              </Text>

              <Text style={{ color: "gray", fontSize: 16 }}>{cart.length}{' '}</Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 8,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "500", color: "gray" }}>
                Delivery{' '}
              </Text>

              <Text style={{ color: "gray", fontSize: 16 }}>₹{totalPrice()}</Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 8,
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                Order Total{' '}
              </Text>

              <Text
                style={{ color: "#C60C30", fontSize: 17, fontWeight: "bold" }}
              >
                ₹{totalPrice()}{' '}
              </Text>
            </View>
          </View>

          <View
            style={{
              backgroundColor: "white",
              padding: 8,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              marginTop: 10,
            }}
          >
            <Text style={{ fontSize: 16, color: "gray" }}>Pay With{' '}</Text>

            <Text style={{ fontSize: 16, fontWeight: "600", marginTop: 7 }}>
              Pay on delivery (Cash){' '}
            </Text>
          </View>

          <Pressable
            onPress={handlePlaceOrder}
            style={{
              backgroundColor: "#FFC72C",
              padding: 10,
              borderRadius: 20,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 20,
            }}
          >
            <Text>Place your order{' '}</Text>
          </Pressable>
        </View>
      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({});
