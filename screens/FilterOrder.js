import React, { useEffect, useState } from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,SafeAreaView, Button } from 'react-native';
import StdButton from './components/button';

function PriceScreen({ navigation }) {
  const [finalPrice, setPrice] = useState('$$');
  const [cat, setCat] = useState('')
  return (
    <SafeAreaView style={styles.container}>
      <Text>What price ?</Text>
      <View style={{flexDirection: 'row'}}>
      <StdButton text = "$$$$" onPress={() =>setPrice('$$$$')} />
      <StdButton text = "$$$" onPress={() =>setPrice('$$$')} />
      <StdButton text = "$$" onPress={() =>setPrice('$$')} />
      <StdButton text = "$" onPress={() =>setPrice('$')} />
      </View>
      <Text>What Cuisine ?</Text>
      <View style={{flexDirection: 'row'}}>
      <StdButton text = "Chinese" onPress={() =>setCat('Chinese')} />
      <StdButton text = "All" onPress={() =>setCat('Others')} />
      </View>
      <StdButton text = "Let's Go!" onPress={() => navigation.navigate('Restaurant', {Price: finalPrice, Cat: cat})} />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceButton: {
    flex: 1,
    color: 'orange',
    borderRadius: '25px',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PriceScreen;