import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import React, { useEffect } from "react";
import LottieView from "lottie-react-native";
import { useNavigation } from "@react-navigation/native";

const OrderScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    // Redirect to the "Main" screen after 1.3 seconds
    const timer = setTimeout(() => {
      navigation.replace("Main"); // Ensure "Main" route is correctly configured
    }, 1300);

    return () => clearTimeout(timer); // Cleanup timeout on unmount
  }, [navigation]);

  return (
    <SafeAreaView style={{ backgroundColor: "white", flex: 1 }}>
    
      <Text
        style={{
          marginTop: 20,
          fontSize: 19,
          fontWeight: "600",
          textAlign: "center",
          justifyContent:'center'
        }}
      >
        Your Order Has Been Received
      </Text>

     
    </SafeAreaView>
  );
};

export default OrderScreen;

const styles = StyleSheet.create({});
