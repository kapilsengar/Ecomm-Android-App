import React, {useEffect, useState, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  Pressable,
  TextInput,
  Image,
} from 'react-native';
import axios from 'axios';
import ProductItems from '../Components/ProductItems';
import DropDownPicker from 'react-native-dropdown-picker';
import {ScrollView} from 'react-native-virtualized-view';
import {useNavigation} from '@react-navigation/native';
import {BottomModal, SlideAnimation, ModalContent} from 'react-native-modals';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function HomeScreen() {
  const list = [
    {
      id: '0',
      image: 'https://m.media-amazon.com/images/I/41EcYoIZhIL._AC_SY400_.jpg',
      name: 'Home',
    },
    {
      id: '1',
      image:
        'https://m.media-amazon.com/images/G/31/img20/Events/Jup21dealsgrid/blockbuster.jpg',
      name: 'Deals',
    },
    {
      id: '3',
      image:
        'https://images-eu.ssl-images-amazon.com/images/I/31dXEvtxidL._AC_SX368_.jpg',
      name: 'Electronics',
    },
    {
      id: '4',
      image:
        'https://m.media-amazon.com/images/G/31/img20/Events/Jup21dealsgrid/All_Icons_Template_1_icons_01.jpg',
      name: 'Mobiles',
    },
    {
      id: '5',
      image:
        'https://m.media-amazon.com/images/G/31/img20/Events/Jup21dealsgrid/music.jpg',
      name: 'Music',
    },
    {
      id: '6',
      image: 'https://m.media-amazon.com/images/I/51dZ19miAbL._AC_SY350_.jpg',
      name: 'Fashion',
    },
  ];
  const deals = [
    {
      id: '20',
      title: 'OnePlus Nord CE 3 Lite 5G (Pastel Lime, 8GB RAM, 128GB Storage)',
      oldPrice: 25000,
      price: 19000,
      image:
        'https://images-eu.ssl-images-amazon.com/images/G/31/wireless_products/ssserene/weblab_wf/xcm_banners_2022_in_bau_wireless_dec_580x800_once3l_v2_580x800_in-en.jpg',
      carouselImages: [
        'https://m.media-amazon.com/images/I/61QRgOgBx0L._SX679_.jpg',
        'https://m.media-amazon.com/images/I/61uaJPLIdML._SX679_.jpg',
        'https://m.media-amazon.com/images/I/510YZx4v3wL._SX679_.jpg',
        'https://m.media-amazon.com/images/I/61J6s1tkwpL._SX679_.jpg',
      ],
      color: 'Stellar Green',
      size: '6 GB RAM 128GB Storage',
    },
    {
      id: '30',
      title:
        'Samsung Galaxy S20 FE 5G (Cloud Navy, 8GB RAM, 128GB Storage) with No Cost EMI & Additional Exchange Offers',
      oldPrice: 74000,
      price: 26000,
      image:
        'https://images-eu.ssl-images-amazon.com/images/G/31/img23/Wireless/Samsung/SamsungBAU/S20FE/GW/June23/BAU-27thJune/xcm_banners_2022_in_bau_wireless_dec_s20fe-rv51_580x800_in-en.jpg',
      carouselImages: [
        'https://m.media-amazon.com/images/I/81vDZyJQ-4L._SY879_.jpg',
        'https://m.media-amazon.com/images/I/61vN1isnThL._SX679_.jpg',
        'https://m.media-amazon.com/images/I/71yzyH-ohgL._SX679_.jpg',
        'https://m.media-amazon.com/images/I/61vN1isnThL._SX679_.jpg',
      ],
      color: 'Cloud Navy',
      size: '8 GB RAM 128GB Storage',
    },
    {
      id: '40',
      title:
        'Samsung Galaxy M14 5G (ICY Silver, 4GB, 128GB Storage) | 50MP Triple Cam | 6000 mAh Battery | 5nm Octa-Core Processor | Android 13 | Without Charger',
      oldPrice: 16000,
      price: 14000,
      image:
        'https://images-eu.ssl-images-amazon.com/images/G/31/img23/Wireless/Samsung/CatPage/Tiles/June/xcm_banners_m14_5g_rv1_580x800_in-en.jpg',
      carouselImages: [
        'https://m.media-amazon.com/images/I/817WWpaFo1L._SX679_.jpg',
        'https://m.media-amazon.com/images/I/81KkF-GngHL._SX679_.jpg',
        'https://m.media-amazon.com/images/I/61IrdBaOhbL._SX679_.jpg',
      ],
      color: 'Icy Silver',
      size: '6 GB RAM 64GB Storage',
    },
    {
      id: '40',
      title:
        'realme narzo N55 (Prime Blue, 4GB+64GB) 33W Segment Fastest Charging | Super High-res 64MP Primary AI Camera',
      oldPrice: 12999,
      price: 10999,
      image:
        'https://images-eu.ssl-images-amazon.com/images/G/31/tiyesum/N55/June/xcm_banners_2022_in_bau_wireless_dec_580x800_v1-n55-marchv2-mayv3-v4_580x800_in-en.jpg',
      carouselImages: [
        'https://m.media-amazon.com/images/I/41Iyj5moShL._SX300_SY300_QL70_FMwebp_.jpg',
        'https://m.media-amazon.com/images/I/61og60CnGlL._SX679_.jpg',
        'https://m.media-amazon.com/images/I/61twx1OjYdL._SX679_.jpg',
      ],
    },
  ];

  const offers = [
    {
      id: '0',
      title:
        'Oppo Enco Air3 Pro True Wireless in Ear Earbuds with Industry First Composite Bamboo Fiber, 49dB ANC, 30H Playtime, 47ms Ultra Low Latency,Fast Charge,BT 5.3 (Green)',
      offer: '72% off',
      oldPrice: 7500,
      price: 4500,
      image:
        'https://m.media-amazon.com/images/I/61a2y1FCAJL._AC_UL640_FMwebp_QL65_.jpg',
      carouselImages: [
        'https://m.media-amazon.com/images/I/61a2y1FCAJL._SX679_.jpg',
        'https://m.media-amazon.com/images/I/71DOcYgHWFL._SX679_.jpg',
        'https://m.media-amazon.com/images/I/71LhLZGHrlL._SX679_.jpg',
        'https://m.media-amazon.com/images/I/61Rgefy4ndL._SX679_.jpg',
      ],
      color: 'Green',
      size: 'Normal',
    },
    {
      id: '1',
      title:
        'Fastrack Limitless FS1 Pro Smart Watch|1.96 Super AMOLED Arched Display with 410x502 Pixel Resolution|SingleSync BT Calling|NitroFast Charging|110+ Sports Modes|200+ Watchfaces|Upto 7 Days Battery',
      offer: '40%',
      oldPrice: 7955,
      price: 3495,
      image: 'https://m.media-amazon.com/images/I/41mQKmbkVWL._AC_SY400_.jpg',
      carouselImages: [
        'https://m.media-amazon.com/images/I/71h2K2OQSIL._SX679_.jpg',
        'https://m.media-amazon.com/images/I/71BlkyWYupL._SX679_.jpg',
        'https://m.media-amazon.com/images/I/71c1tSIZxhL._SX679_.jpg',
      ],
      color: 'black',
      size: 'Normal',
    },
    {
      id: '2',
      title: 'Aishwariya System On Ear Wireless On Ear Bluetooth Headphones',
      offer: '40%',
      oldPrice: 7955,
      price: 3495,
      image: 'https://m.media-amazon.com/images/I/41t7Wa+kxPL._AC_SY400_.jpg',
      carouselImages: ['https://m.media-amazon.com/images/I/41t7Wa+kxPL.jpg'],
      color: 'black',
      size: 'Normal',
    },
    {
      id: '3',
      title:
        'Fastrack Limitless FS1 Pro Smart Watch|1.96 Super AMOLED Arched Display with 410x502 Pixel Resolution|SingleSync BT Calling|NitroFast Charging|110+ Sports Modes|200+ Watchfaces|Upto 7 Days Battery',
      offer: '40%',
      oldPrice: 24999,
      price: 19999,
      image: 'https://m.media-amazon.com/images/I/71k3gOik46L._AC_SY400_.jpg',
      carouselImages: [
        'https://m.media-amazon.com/images/I/41bLD50sZSL._SX300_SY300_QL70_FMwebp_.jpg',
        'https://m.media-amazon.com/images/I/616pTr2KJEL._SX679_.jpg',
        'https://m.media-amazon.com/images/I/71wSGO0CwQL._SX679_.jpg',
      ],
      color: 'Norway Blue',
      size: '8GB RAM, 128GB Storage',
    },
  ];
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState('jewelery');
  const [modalVisible, setModalVisible] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [items, setItems] = useState([
    {label: "Men's clothing", value: "men's clothing"},
    {label: 'jewelery', value: 'jewelery'},
    {label: 'electronics', value: 'electronics'},
    {label: "women's clothing", value: "women's clothing"},
  ]);

  const onGenderOpen = useCallback(() => {
    setCompanyOpen(false);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://fakestoreapi.com/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error.message);
      }
    };
    fetchData();
  }, []);
  console.log('products', products);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        console.log('Fetching addresses...');

        // Retrieve user email
        const useremail = await AsyncStorage.getItem('email');
        if (!useremail) {
          console.error('No email found.');
          setError('Email is missing. Please log in again.');
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
        setError('Failed to fetch addresses. Please try again.');
      }
    };

    fetchAddresses();
  }, []);

  

  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <ScrollView style={{flex: 1}} nestedScrollEnabled={true}>
          {/*------------------- Search Bar--------------------------------------------------------- */}
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

          {/*------------------- Delivery information--------------------------------------------------------- */}
          <Pressable
            onPress={() => setModalVisible(!modalVisible)}
            style={{
              flexDirection: 'row',
              padding: 10,
              backgroundColor: '#F9DDA4',
              gap: 8,
              alignItems: 'center',
            }}>
            <Image
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/128/927/927667.png',
              }}
              style={{width: 24, height: 24}}
            />
            <Pressable>
            {selectedAddress ? (
                <Text>
                  Deliver to {selectedAddress?.name} - {selectedAddress?.street}{'          '}
                </Text>
              ) : (
                <Text style={{ fontSize: 13, fontWeight: "500" }}>
                    Add a Address
                </Text>
              )}
            </Pressable>
            <Image
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/128/2722/2722987.png',
              }}
              style={{width: 24, height: 24}}
            />
          </Pressable>

          {/*-------------------Horizontal List--------------------------------------------------------- */}
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={list}
            keyExtractor={(item, index) => index.toString()} // or use a unique id if available
            renderItem={({item}) => (
              <Pressable
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: 10,
                }}>
                <Image
                  style={{height: 50, width: 50, resizeMode: 'contain'}}
                  source={{uri: item.image}}
                />
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 12,
                    fontWeight: '500',
                    marginTop: 5,
                  }}>
                  {item.name}
                </Text>
              </Pressable>
            )}
          />

          {/*------------------- Carausal List--------------------------------------------------------- */}

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Image
              source={{
                uri: 'https://img.freepik.com/free-photo/purchase-sale-discount-fashion-style_53876-15282.jpg?semt=ais_hybrid',
              }}
              style={{
                width: '450',
                height: 220,
                resizeMode: 'cover',
                padding: 6,
              }}
            />
          </ScrollView>

          {/*------------------- Trending Deals of the Week--------------------------------------------------------- */}
          <Text style={{fontSize: 18, fontWeight: '500', padding: 8}}>
            Trending Deals of the Week
          </Text>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              alignItems: 'center',
            }}>
            {deals.map((item, index) => (
              <Pressable
                onPress={() =>
                  navigation.navigate('ProductInfo', {
                    id: item.id,
                    title: item.title,
                    price: item.price,
                    image: item.image,
                    carouselImages: item.carouselImages,
                    color: item.color,
                    size: item.size,
                    oldPrice: item.oldPrice,
                    item: item,
                  })
                }
                key={index}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginVertical: 10,
                  marginHorizontal: 10,
                }}>
                <Image
                  source={{uri: item.image}}
                  style={{width: 180, height: 180}}
                />
              </Pressable>
            ))}
          </View>
          <Text
            style={{
              height: 1,
              borderColor: '#D0D0D0',
              borderWidth: 2,
              marginTop: 15,
            }}
          />

          {/*------------------- Today's Deals--------------------------------------------------------- */}
          <Text style={{fontSize: 18, fontWeight: '500', padding: 8}}>
            Today's Deals
          </Text>
          <View>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={offers}
              keyExtractor={(item, index) => index.toString()} // or use a unique id if available
              renderItem={({item}) => (
                <Pressable
                  onPress={() =>
                    navigation.navigate('ProductInfo', {
                      id: item.id,
                      title: item.title,
                      price: item.price,
                      image: item.image,
                      carouselImages: item.carouselImages,
                      color: item.color,
                      size: item.size,
                      oldPrice: item.oldPrice,
                      item: item,
                    })
                  }
                  style={{
                    marginVertical: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 2,
                  }}>
                  <Image
                    style={{height: 150, width: 150, resizeMode: 'contain'}}
                    source={{uri: item.image}}
                  />
                  <View
                    style={{
                      backgroundColor: '#E31837',
                      paddingVertical: 5,
                      width: 130,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: 10,
                      borderRadius: 4,
                    }}>
                    <Text
                      style={{
                        textAlign: 'center',
                        color: 'white',
                        fontSize: 13,
                        fontWeight: 'bold',
                      }}>
                      Upto {item?.offer}
                    </Text>
                  </View>
                </Pressable>
              )}
            />
          </View>

          {/*------------------- DropDown--------------------------------------------------------- */}

          <Text
            style={{
              height: 1,
              borderColor: '#D0D0D0',
              borderWidth: 2,
              marginTop: 15,
            }}
          />
          <DropDownPicker
            style={{
              borderColor: '#B7B7B7',
              height: 30,
              marginBottom: open ? 120 : 5,
              alignItems: 'center',
              width: 200,
              marginTop: 20,
              marginLeft: 10,
            }}
            open={open}
            value={category} //genderValue
            items={items}
            setOpen={setOpen}
            setValue={setCategory}
            setItems={setItems}
            placeholder="choose category"
            onOpen={onGenderOpen}
            // onChangeValue={onChange}
            zIndex={3000}
            zIndexInverse={1000}
          />

          {/*-------------------Fake Store API--------------------------------------------------------- */}
          <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
            {products
              .filter(item => item.category === category)
              .map((item, index) => (
                <ProductItems item={item} key={index} />
              ))}
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Bottom Model */}

      <BottomModal
        onBackdropPress={() => setModalVisible(!modalVisible)}
        swipeDirection={['up', 'down']}
        swipeThreshold={200}
        modalAnimation={
          new SlideAnimation({
            slideFrom: 'bottom',
          })
        }
        onHardwareBackPress={() => setModalVisible(!modalVisible)}
        visible={modalVisible}
        onTouchOutside={() => setModalVisible(!modalVisible)}>
        <ModalContent style={{width: '100%', height: 400}}>
          <View style={{marginBottom: 8}}>
            <Text style={{fontSize: 16, fontWeight: '500'}}>
              Choose your Location
            </Text>

            <Text style={{marginTop: 5, fontSize: 16, color: 'gray'}}>
              Select a delivery location to see product availabilty and delivery
              options
            </Text>
          </View><FlatList
  horizontal
  showsHorizontalScrollIndicator={false}
  data={addresses}
  keyExtractor={(item, index) => index.toString()} // Use unique key if available
  renderItem={({ item }) => (
    <Pressable
      onPress={() => setSelectedAddress(item)} // Correctly passing the function
      style={{
        width: 140,
        height: 140,
        borderColor: '#D0D0D0',
        borderWidth: 1,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 3,
        marginRight: 15,
        marginTop: 10,
        backgroundColor: selectedAddress === item ? '#FBCEB1' : 'white', // Conditional background color
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
        <Text style={{ fontSize: 13, fontWeight: 'bold' }}>{item?.name}</Text>
      </View>

      <Text
        numberOfLines={1}
        style={{ width: 130, fontSize: 13, textAlign: 'center' }}
      >
        {item?.houseNo},{item?.landmark}
      </Text>

      <Text
        numberOfLines={1}
        style={{ width: 130, fontSize: 13, textAlign: 'center' }}
      >
        {item?.street}
      </Text>

      <Text
        numberOfLines={1}
        style={{ width: 130, fontSize: 13, textAlign: 'center' }}
      >
        India, Bangalore
      </Text>
    </Pressable>
  )}
  ListFooterComponent={() => (
    <Pressable
      onPress={() => {
        setModalVisible(false);
        navigation.navigate('Address');
      }}
      style={{
        width: 140,
        height: 140,
        borderColor: '#D0D0D0',
        marginTop: 10,
        borderWidth: 1,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text
        style={{
          textAlign: 'center',
          color: '#0066b2',
          fontWeight: '500',
        }}
      >
        Add an Address or pick-up point
      </Text>
    </Pressable>
  )}
/>


          <View style={{flexDirection: 'column', gap: 7, marginBottom: 30}}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
              <Image
                style={{height: 22, width: 22}}
                source={{
                  uri: 'https://cdn-icons-png.flaticon.com/128/18598/18598802.png',
                }}
              />
              <Text style={{color: '#0066b2', fontWeight: '400'}}>
                Enter an Indian pincode
              </Text>
            </View>

            <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
              <Image
                style={{height: 22, width: 22}}
                source={{
                  uri: 'https://cdn-icons-png.flaticon.com/128/565/565949.png',
                }}
              />
              <Text style={{color: '#0066b2', fontWeight: '400'}}>
                Use My Currect location
              </Text>
            </View>

            <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
              <Image
                style={{height: 22, width: 22}}
                source={{
                  uri: 'https://cdn-icons-png.flaticon.com/128/3083/3083741.png',
                }}
              />
              <Text style={{color: '#0066b2', fontWeight: '400'}}>
                Deliver outside India
              </Text>
            </View>
          </View>
        </ModalContent>
      </BottomModal>
    </>
  );
}

const styles = StyleSheet.create({});
