import React, { useEffect, useState, Component } from 'react';
import { StatusBar } from 'expo-status-bar';
import {StyleSheet,Text,SafeAreaView, Divider, ScrollView } from 'react-native';
import StdButton from '../components/button';
import BottomTabs from '../BottomBar';
import RestaurantItem from '../components/RestaurantItem';
import { localRestaurants} from '../components/RestaurantItem';
import GetLocation from 'react-native-get-location'
import config from '../../config'

const YELP_API_KEY = config.API_KEY;


function Favourites({ navigation }) {
  const [restaurantData,setRestaurantData] = useState(localRestaurants)
     
    
  const getDataFromYelp = () => {
    const yelpURL = `https://api.yelp.com/v3/businesses/search?term=restaurants&location=Singapore&offset=${offset}&limit=30`
    const apiOptions = {
      headers: {
        Authorization : `Bearer ${YELP_API_KEY}`,
      },
    }
    
    return fetch(yelpURL, apiOptions)
    .then((res) => res.json())
    .then((json) =>setRestaurantData(
      json.businesses
      ))
    .catch(error => alert(error.message));
  };

  useEffect(() => {
      getDataFromYelp();
    }, []);


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <RestaurantItem restaurantData = {restaurantData}/>
      </ScrollView>
      <Text>   </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Favourites;