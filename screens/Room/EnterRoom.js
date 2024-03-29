import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View,SafeAreaView,Dimensions, Button, TextInput, ImageBackground, } from 'react-native';
import { authentication } from "../../firebase/firebase-config";
import {
  getFirestore,collection,getDocs,
  addDoc, updateDoc,doc
} from 'firebase/firestore'
import StdButton from '../components/button';

import * as Location from 'expo-location';


export default function App({route,navigation}) {
  global.roomVegetarian = false
  global.roomVegan = false
  global.roomHalal = false

  const [name,setName] = useState('')
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [locPerm, setLocPerm] = useState(0);
  const [long,setLong] =useState(0)
  const [lat,setLat] = useState(0)
  let temp = []

  const createRoom = (username,navigation) => {
    navigation.navigate('CreateRoom', {username: username,long:long, lat:lat})
  }

 const enterRoom = (name,navigation) => {
  let valid = false
  const db = getFirestore()
  const colRef = collection(db,'RoomIDs')
  getDocs(colRef).then((snapshot) => {
    snapshot.docs.forEach((Doc) => {
      if(Doc.id == name){
        valid = true
        global.room = name
        navigation.navigate('Room',{name: name, long:long, lat:lat})
      }
    })
    return temp
  }).then(() => {
    if(!valid) {
      alert("No room with that name")
    }
  })
 }

 useEffect(() => {
  if(locPerm != 0)
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
}, [locPerm]);


  useEffect(()=> {
    if (errorMsg) {
      long = errorMsg;
    } else if (location) {
     setLong(location.coords.longitude)
     setLat(location.coords.latitude)
    }
  },[location])
  

  return (
    <SafeAreaView style={styles.parentContainer}>
      {/* <ImageBackground source={require('../../assets/WhereTwoEatGroupOrderSimple.png')} resizeMode="cover" style = {styles.image}> */}
        <Text style={{ textAlign: "center", fontSize:30, fontWeight:'bold', paddingBottom: 200}}>Join a room!</Text>

        <View style={styles.absoluteUnit}>
        {/* <View style={{ padding:5, margin: 10, borderRadius: 5, flexDirection: 'row', }}> */}
        <TextInput placeholder = "Name"  onChangeText = {text => setName(text)} style = {styles.roomNameInput} />
        <View style={{ right: 55, padding:5.7, margin: 5, position: `absolute` }}>
        {/* <View style={{ windowWidth - 195, padding:5.7, margin: 5, position: `absolute` }}> */}
        <StdButton text = "Enter" onPress={() => enterRoom(name, navigation)}/>
        </View>
        </View>
        <View style={styles.bottomButton}>
        <StdButton text = "Create a new Room" onPress={() => createRoom(name, navigation)} />
        </View>
      {/* </ImageBackground> */}
    </SafeAreaView>
  );
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
    parentContainer: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      // how I prevent keyboard from moving items
      position: 'absolute',
      left: 0,
      top: 0,
      width: windowWidth,
      height: windowHeight - 70,
    },
    roomNameInput: {
      backgroundColor: '#e9e9e9',
      height: 60,
      width: windowWidth - 150,
      borderRadius: 50,
      paddingVertical: 10,
      paddingHorizontal: 15,
      margin: 5,
      // specifically for text to not clash with enter button
      paddingRight: 100,
      // making room name input absolute to match with button

    },
    absoluteUnit: {
      position: "absolute",
      left: 10,
      right: 10,
      justifyContent: "center",
      alignItems: 'center',
    },
    bottomButton : {
      position: 'absolute',
      bottom:30,
      left: 0,
      right: 0,
      justifyContent: "center",
      alignItems: 'center',
    },
    image: {
      flex: 1,
      justifyContent: "center",
      width: windowWidth,
    },
  });