import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  Pressable,
  TextInput,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';  // Import axios

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigation = useNavigation();

  const handleRegister = async () => {
    let user = {
      name,
      email,
      password,
    };
    console.log('User:', JSON.stringify(user));  // Log user data

    try {
      // Update URL to work with Android emulator
      const response = await axios.post(
        'http://10.0.2.2:8000/register',  // Use this IP for Android Emulator
        user,
        { headers: { 'Content-Type': 'application/json' } }  // Set correct content type
      );
      Alert.alert(
        "Registration successful",
        "You have been registered Successfully"
      );
      setEmail("")
      setName("")
      setPassword("")
    
      console.log('Registration successful:', response.data);
    } catch (error) {
      console.error('Registration failed:', error.response || error.toJSON());
      Alert.alert(
        "Registration Error",
        "An error occurred while registering"
      );
    }
  };

  return (
    <SafeAreaView style={{flex: 1, alignItems: 'center'}}>
      <View>
        <Image
          style={{width: 150, height: 100, marginTop: 50,resizeMode:'contain'}}
          source={{
            uri: 'https://assets.stickpng.com/thumbs/5f44f3e6acda2c000402a6ee.png',
          }}
        />
      </View>

      <View>
        <Text style={{fontSize: 17, fontWeight: 'bold', marginTop: 12}}>
          Register to your Account
        </Text>
      </View>

      <View>
        <View style={{marginTop: 70}}>
          <TextInput
            value={name}
            onChangeText={(text) => setName(text)}
            style={{
              backgroundColor: '#8395A7',
              padding: 8,
              color: 'black',
              marginVertical: 10,
              width: 300,
              borderRadius: 6,
              fontSize: 18,
            }}
            placeholder="Enter your Name"
          />
        </View>
        <View style={{marginTop: 20}}>
          <TextInput
            value={email}
            onChangeText={setEmail}
            style={{
              backgroundColor: '#8395A7',
              padding: 8,
              color: 'black',
              marginVertical: 10,
              width: 300,
              borderRadius: 6,
              fontSize: 18,
            }}
            placeholder="Enter your E-mail"
          />
        </View>
        <View style={{marginTop: 20}}>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            style={{
              backgroundColor: '#8395A7',
              padding: 8,
              marginVertical: 10,
              width: 300,
              borderRadius: 6,
              fontSize: 18,
            }}
            placeholder="Enter your Password"
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 10,
          }}>
          <Text>Keep me Logged In</Text>
          <Text style={{color: '#25CCF7'}}>Forgot password</Text>
        </View>
      </View>

      <View style={{marginTop: 80}}>
        <Pressable
          onPress={handleRegister}
          style={{
            backgroundColor: '#F3B431',
            width: 200,
            borderRadius: 6,
            marginLeft: 'auto',
            marginRight: 'auto',
            padding: 8,
          }}>
          <Text style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>
            Register
          </Text>
        </Pressable>
        <Pressable onPress={() => navigation.goBack()} style={{marginTop: 15}}>
          <Text style={{fontSize: 15, color: 'grey', textAlign: 'center'}}>
            Already have an Account? Login
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
