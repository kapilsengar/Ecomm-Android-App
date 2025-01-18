import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ModalPortal } from "react-native-modals";

import StackNavigatior from './navigation/StackNavigatior'
import { CartProvider } from './Context/CartContext'

export default function App() {
  return (
  <>
  <CartProvider>
  <StackNavigatior/>
<ModalPortal/>
  </CartProvider>
  </>
   
  )
}

const styles = StyleSheet.create({})