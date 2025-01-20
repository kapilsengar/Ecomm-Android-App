import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  TextInput,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddAddressScreen = () => {
  const navigation = useNavigation();
  const [addresses, setAddresses] = useState([]);

  // Fetch addresses on component mount
  useEffect(() => {
    fetchAddresses();
  }, []);

  // Fetch addresses function
  const fetchAddresses = async () => {
    try {
      const useremail = await AsyncStorage.getItem('email');
      console.log('email', useremail);
      const response = await axios.get(
        'http://192.168.174.10:8000/addresses',

        {
          headers: {'Content-Type': 'application/json'},
          params: {useremail}, // Add useremail as query parameter
        },
      );
      setAddresses(response.data);
      console.log('Addresses fetched successfully:', response.data);
    } catch (err) {
      setError('Failed to fetch addresses. Please try again.');
      console.error('Error fetching addresses:', err);
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Pressable style={styles.searchInput}>
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/128/3031/3031293.png',
            }}
            style={styles.icon}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Search in Trendify"
            placeholderTextColor="black"
          />
        </Pressable>
        <Image
          source={{
            uri: 'https://cdn-icons-png.flaticon.com/128/709/709950.png',
          }}
          style={styles.searchIcon}
        />
      </View>

      {/* Title and Add New Address */}
      <View style={{padding: 10}}>
        <Text style={styles.title}>Your Addresses</Text>

        <Pressable
          onPress={() => navigation.navigate('Add')}
          style={styles.addAddressButton}>
          <Text>Add a new Address</Text>
          <Image
            style={{height: 24, width: 24}}
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/128/271/271228.png',
            }}
          />
        </Pressable>
      </View>

      {/* Fetch Addresses Button */}
      <Pressable onPress={fetchAddresses} style={styles.fetchButton}>
        <Text style={styles.fetchButtonText}>Reload Addresses</Text>
      </Pressable>

      {/* Render Addresses */}

      {addresses?.length > 0 ? (
        addresses.map((item, index) => (
          <Pressable
            key={index}
            style={{
              borderWidth: 1,
              borderColor: '#D0D0D0',
              padding: 10,
              flexDirection: 'column',
              gap: 5,
              marginVertical: 10,
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 3}}>
              <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                {item?.name || 'No name provided'}
              </Text>
              <Image
                style={{height: 22, width: 22}}
                source={{
                  uri: 'https://cdn-icons-png.flaticon.com/128/535/535188.png',
                }}
              />
            </View>

            <Text style={{fontSize: 15, color: '#181818'}}>
              {item?.houseNo ? `${item?.houseNo}, ` : ''}
              {item?.landmark || 'No landmark provided'}
            </Text>

            <Text style={{fontSize: 15, color: '#181818'}}>
              {item?.street || 'No street provided'}
            </Text>

            <Text style={{fontSize: 15, color: '#181818'}}>
              India, Bangalore
            </Text>

            <Text style={{fontSize: 15, color: '#181818'}}>
              phone No : {item?.mobileNo || 'No mobile number'}
            </Text>

            <Text style={{fontSize: 15, color: '#181818'}}>
              pin code : {item?.postalCode || 'No postal code'}
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
                <Text>Edit</Text>
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
                <Text>Remove</Text>
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
                <Text>Set as Default</Text>
              </Pressable>
            </View>
          </Pressable>
        ))
      ) : (
        <Text>No addresses available</Text>
      )}
    </ScrollView>
  );
};

export default AddAddressScreen;

const styles = StyleSheet.create({
  searchBar: {
    backgroundColor: '#F5C469',
    flexDirection: 'row',
    alignItems: 'center',
    paddingEnd: 5,
  },
  searchInput: {
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
  },
  icon: {
    width: 24,
    height: 24,
  },
  textInput: {
    height: 38,
    flex: 1,
    textDecorationColor: 'black',
    color: 'red',
  },
  searchIcon: {
    width: 30,
    height: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  addAddressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    borderColor: '#D0D0D0',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    paddingVertical: 7,
    paddingHorizontal: 5,
  },
  fetchButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    marginHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  fetchButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginHorizontal: 20,
    marginTop: 10,
  },
  addressCard: {
    padding: 10,
    margin: 10,
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 5,
  },
});
