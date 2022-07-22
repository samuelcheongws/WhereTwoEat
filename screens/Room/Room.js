import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View,SafeAreaView, Button, TextInput, TouchableOpacity,Dimensions} from 'react-native';
import { authentication } from "../../firebase/firebase-config";
import Slider from '@react-native-community/slider'; 
import {
  getFirestore,collection,getDocs,
  addDoc, updateDoc, setDoc,doc, getDoc
} from 'firebase/firestore'
import StdButton from '../components/button';
import {StdButtonBlue} from '../components/button';
import {StdButtonSmall} from '../components/button';
import {CenterButton} from '../components/button';
import {StdButtonRandomColor} from '../components/button';
import { clearUpdateCacheExperimentalAsync } from "expo-updates";
import {renderLoading,renderCountPrice,renderCountCat,renderCurrentVotePrice} from '../components/RoomComponents'
import FontAwesome from "react-native-vector-icons/FontAwesome";


export default function App({route,navigation}) {
  const db = getFirestore()
  const colRef = collection(db,'RoomIDs')
  const [rooms, setRooms] = useState()
  const [range, setRange] = useState(1);
  const [votePrice, setVotePrice] = useState(0)
  const [cat, setCat] = useState('Others')
  const [state,setState] = useState(0)
  const [loc,setLoc] = useState(0)
  let loading = false;
  let sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

  if(rooms == undefined){
    getDocs(colRef).then((snapshot) => {
      snapshot.docs.forEach((doc) => {
        if(doc.id == route.params.name){
          setRooms(doc.data())
        }
      })
    })
    .catch(err => {
      console.log(err);
    })
  }

  
  
  useEffect(() => {
    sleep(100).then(() => {
      setState(state+1)
    })
    .catch(err => {
      alert(err);
    })
  }, [state])

  const renderButton = (price) => {
    let op = 0.5;
    if(price <= range){
      op = 1;
    }
    return <TouchableOpacity  onPress={() => {setRange(price)}}>
    <FontAwesome name="dollar" size ={55} color = "#000000" style ={{opacity : op , borderWidth: 10, borderColor: 'white'}}/>
		</TouchableOpacity>
  }

  const castVote = () => {
    if(!global.disabled){
      global.disabled = true;
      sleep(2000).then(() => {
        global.disabled = false;
      })
      try {
        loading = true;
        let name = global.user.uid
        let first = rooms[name] == undefined
        if(first) {
          firstTime()
        } else {
          let prevPrice = rooms[name][0]
          let prevCat = rooms[name][1]
          if(prevPrice != range ){
            updatePrice()
          }
          if(prevCat != cat){
            updateCat()
          }
        }
        } catch (error) {
          alert("Something went wrong. Please wait a bit for the data to load")
        } finally {
          sleep(2000).then(() => {
            getDocs(colRef).then((snapshot) => {
              snapshot.docs.forEach((doc) => {
                if(doc.id == route.params.name){
                  setRooms(doc.data())
                }
              })
            })
            .catch(err => {
              console.log(err);
            })
          })     
        }
    } else {
      alert("Please wait a bit for the database to update")
    }
  }

  const updateCat = () => {
    let name = global.user.uid
    let prevCat = ""
    let prevCatCount = 0
    let curCatCount = 0
    let curRoom = undefined
    getDocs(colRef)
    .then((snapshot) => {
      snapshot.docs.forEach((doc) => {
        if(doc.id == route.params.name){
          curRoom = doc.data()
          prevCat = doc.data()[name][1]
          prevCatCount = doc.data()[prevCat]
          curCatCount = doc.data()[cat]
        }
      })
    })
    .then(() => {
      curRoom[cat] = curCatCount +1
      curRoom[prevCat] = prevCatCount -1
      curRoom[name] = [range,cat]
      setRooms(curRoom)
      updateDoc(doc(db,'RoomIDs',rooms["name"]),{[name] : [range,cat], [cat] : curCatCount +1, [prevCat] : prevCatCount -1})
       })
    }

  const updatePrice= () => {
      let name = global.user.uid
      let prevPrice = 0
      let prevPriceCount = 0
      let curPriceCount = 0
      let curRoom = undefined
      getDocs(colRef)
      .then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          if(doc.id == route.params.name){
            curRoom = doc.data()
            prevPrice = doc.data()[name][0]
            prevPriceCount = doc.data()[prevPrice]
            curPriceCount = doc.data()[range]
          }
        })
      })
      .then(() => {
        curRoom[range] = curPriceCount +1
        curRoom[prevPrice] = prevPriceCount -1
        curRoom[name] = [range,cat]
        setRooms(curRoom)
        updateDoc(doc(db,'RoomIDs',rooms["name"]),{[name] : [range,cat], [range] : curPriceCount +1, [prevPrice] : prevPriceCount -1})
         })
    } 
  
  const firstTime = () => {
    let name = global.user.uid
    let curPriceCount = 0
    let curCatCount = 0
    getDocs(colRef)
    .then((snapshot) => {
      snapshot.docs.forEach((doc) => {
        if(doc.id == route.params.name){
          curPriceCount = doc.data()[range]
          curCatCount = doc.data()[cat]
        }
      })
    })
    let temp = rooms
        temp[range] = curPriceCount +1
        temp[cat] = curCatCount +1
        temp[name] = [range,cat]
        setRooms(temp)
    updateDoc(doc(db,'RoomIDs',rooms["name"]),{ [name] : [range,cat], [range] :curPriceCount +1, [cat] : curCatCount +1 })
  }

  const exit = () => {
    global.room = ''
    navigation.navigate('EnterRoom')
  }

  const getHighestCat = () => {
    let max = 0.1;
    let cat = ''
    if(rooms['Chinese']> max) {
      max = rooms['Chinese']
      cat  = 'chinese'
    } 
    else if(rooms['Chinese'] ==  max) {
      cat += ',' + 'chinese'
    }
    if(rooms['Japanese']> max) {
      max = rooms['Japanese']
      cat  = 'japanese'
    } 
    else if(rooms['Japanese'] == max) {
      cat += ',' + 'japanese'
    }
    if(rooms['Italian']> max) {
      max = rooms['Italian']
      cat  = 'italian'
    } 
    else if(rooms['Italian'] == max) {
      cat += ',' + 'italian'
    }
    if(rooms['Others']> max) {
      max = rooms['Others']
      cat  = 'others'
    }
    else if(rooms['Others'] == max) {
      cat += ',' + 'others'
    }
    if(rooms['Indian']> max) {
      max = rooms['Indian']
      cat  = 'indian'
    }
    else if(rooms['Indian'] == max) {
      cat += ',' + 'indian'
    }
    if(rooms['Fastfood']> max) {
      max = rooms['Fastfood']
      cat  = 'hotdogs'
    }
    else if(rooms['Fastfood'] == max) {
      cat += ',' + 'hotdogs'
    }
    if(rooms['Cafe']> max) {
      max = rooms['Cafe']
      cat  = 'cafe'
    }
    else if(rooms['Cafe'] == max) {
      cat += ',' + 'cafe'
    }
    return cat
  }

  const getHighestPrice = () => {
    let max = 0.1
    let price = ""
    for (let i = 0; i < 5; i++) {
      if(rooms[i]> max) {
        max = rooms[i]
        price  = JSON.stringify(i)
      } else if(rooms[i] == max) {
        price += ',' + JSON.stringify(i)
      }
    }
    return price
  }
  
  const getResults = () => {
    
    try {
      let p = getHighestPrice()
      let c = getHighestCat()
      if(p == '' || c == ''){
        alert("Something went wrong. Did you remember to put at least one vote?")
      } else {
        
       navigation.navigate('RestaurantRoom', {room:true, term: rooms.term, price: p, cat: c, loc: `&location=${rooms.loc}`})
      }
      } catch (error) {
        alert("Something went wrong. Please wait a bit for the data to load")
      }
  }

  const catButton = (num,name,curCat) => {
    if(rooms == undefined){
      return  <StdButton text = {name + `0`} onPress={() => setCat(curCat)} />
    }
    if(cat == curCat){
      return <StdButtonBlue text = {name + `${rooms[curCat]}`} onPress={() => setCat(curCat)}/>
    } else {
      return <StdButtonRandomColor num={num} text = {name + `${rooms[curCat]}`} onPress={() => setCat(curCat)} />
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{backgroundColor:"#e9e9e9", width: windowWidth, alignItems: "center", margin: 20, padding: 10, bottom:70}}>
        <Text style={styles.text}>Room Name: {route.params.name}</Text>
      </View>
      {renderLoading(loading)}
      <View>
      {renderCountPrice(rooms)}
      </View>
      {renderCurrentVotePrice(votePrice)}
      

      {/* <Slider
      style={{width: 200, height: 40}}
      minimumValue={1}
      maximumValue={4}
      step={1}
      thumbTintColor="orange"
      onValueChange={value => setRange(parseInt(value))}
      maximumTrackTintColor="#000000"        
      minimumTrackTintColor = 'orange'
      /> */}

      <View style={{flexDirection: 'row', alignItems: 'center', padding: 10}}>
      {renderButton(1)}
      {renderButton(2)}
      {renderButton(3)}
      {renderButton(4)}
      
      </View>
      <View style={{flexDirection: 'row', flexWrap:'wrap', justifyContent:'center', paddingBottom: 20}}>
      {catButton(1,"Chinese: " ,'Chinese')}
      {catButton(2,'Japanese: ','Japanese')}
      {catButton(3,"Italian: ",'Italian')}
      {catButton(3,"Cafe: " ,'Cafe')}
      {catButton(2,"Fastfood: " ,'Fastfood')}
      {catButton(1,"Indian: " ,'Indian')}
      {catButton(3,"Others: " ,'Others')}
      </View>
      <View style = {styles.bottomButton}>
      <StdButtonSmall text = "Exit Room" onPress={() => exit()}/>
      <CenterButton text = "Cast Vote!" onPress={() => {castVote()}} />
      <StdButtonSmall text = "Get Results" onPress={() => getResults()}/>
      </View>
      
    </SafeAreaView>
    
  );
}
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
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
  input: {
    backgroundColor: 'white',
    borderColor: '#e8e8e8',
    borderWidth: 1,
    backgroundColor: '#e9e9e9',
    // borderColor: '#e8e8e8',
    // borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    margin: 5,
  },
  cat: {
    borderWidth: 1,
    backgroundColor: '#e9e9e9',
    // borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    margin: 5,
  },
  text: {
    fontSize: 28,
  },
  bottomButton : {
    // width:200,
    position: 'absolute',
    bottom:30,
    // left: (windowWidth-365)/2,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
  },
  
}); 