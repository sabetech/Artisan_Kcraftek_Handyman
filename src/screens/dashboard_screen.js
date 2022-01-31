import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, Modal,Pressable} from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import * as firebase from 'firebase';
import {loggingOut, toggleOffline, previewTask, declineTask} from '../../api/firebase_functions';
import Stars from './rating_stars';
import { useUserInfo } from '../contexts/UserContext';
import "firebase/firestore";
import { Audio } from 'expo-av';
import KcraftekStatus from '../components/kcraftek_status';

const kcraftek_color = "hsla(120, 60%, 26%, 1)";

export default function Dashboard({ navigation }) {
  const [fullname, setFirstName] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);
  const currentUserUID = firebase.auth().currentUser.uid;
  const userInfoContext = useUserInfo();
  const [statusOfApp, setStatusOfApp] = useState('Stay online/available to keep getting Client Requests!');
  const [sound, setSound] = React.useState();
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    async function getUserInfo(){
      try {
        let doc = await firebase
          .firestore()
          .collection('artisan_users')
          .doc(currentUserUID)
          .get();

        if (!doc.exists){
          Alert.alert('No user data found!')
        } else {
          let dataObj = doc.data();
          setFirstName(dataObj.name);
          setIsEnabled(dataObj.is_active);
          userInfoContext.setUserInfo({...dataObj, id: doc.id});
          
        }
      } catch (err){
      Alert.alert('There is an error.', err.message)
      }
    }
    getUserInfo();
  },[]);

  useEffect(() => {
    //requests are gonna come thru here ... :-) not great but yeah ... 
    const db = firebase.firestore();
    const unsubscribe = db.collection('artisan_users').doc(currentUserUID)
          .onSnapshot(querySnapshot => {
           userInfoContext.setUserInfo(querySnapshot.data());
    });

    return unsubscribe;
  },[]);

  useEffect(() => {

    //check to see if the userInfo is status is requesting ... 
    if (userInfoContext.userInfo.request?.status == 'requesting'){
        //play a sound and be changing the color up there till he responds or someone else responds
        playIncomingRequestSound();
        setStatusOfApp("Your Service is being Requested!");
        setModalVisible(true);
    }

    if (userInfoContext.userInfo.request?.status == 'preview'){
      
      navigation.navigate('MapScreen', {
        requestInfo: userInfoContext.userInfo
      });
    }

  },[userInfoContext.userInfo]);

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync(); }
      : undefined;
  }, [sound]);

  const handleToggleAvailability = () => {

    setIsEnabled(previousState => !previousState);
    toggleOffline(userInfoContext.userInfo);

  }

  async function playIncomingRequestSound(){
    
    const { sound } = await Audio.Sound.createAsync(
       require('../../assets/i-did-it-message-tone.mp3')
    );
    setSound(sound);
    sound.setIsLoopingAsync(false);
    
    await sound.playAsync();
  }

  //This function belongs to the maps screen!!!
  const _previewRequestInfo = () => {
    previewTask(userInfoContext.userInfo);
    setStatusOfApp("You are previewing the request!!!");
    setModalVisible(false);

    //navigate to a map screen with the client location and task information
  }

  const artisanStatus = () => {
    if (userInfoContext.userInfo.is_active){

      switch(userInfoContext.userInfo.request.status){
        case "idle":
          return "Available";
        case "requesting":
          return "Incoming Request ...";
        case "accepted":
          return "Request Accepted. Yet to get to destination.";
        case "arrived":
          return "Arrived at destination!";
        case "job_started":
          return "Busy!"
        case "job_completed":
          return "Task Completed";
      }

    }
    return "Unknown Status";
  }

  const _no = () => {
    setModalVisible(false);
    declineTask(userInfoContext.userInfo);
    setStatusOfApp("You declined a request from a client!");
  }

  const handlePress = () => {
    
    loggingOut();
    navigation.replace('Home');
  };

  return (
    <View style={{flex: 1}}>
      
        <StatusBar />
        <View style={[styles.headPanel, {backgroundColor: isEnabled ? kcraftek_color:'#dbdbdb'}]}>
          <Text style={[styles.headPanelText, {color: isEnabled ? 'white' :kcraftek_color}]}>Good Day <Text style={{fontWeight: 'bold', fontStyle: 'italic'}}>{fullname && fullname.split(' ')[0]}!</Text></Text>
          <KcraftekStatus isEnabled={isEnabled} kcraftek_color={kcraftek_color} statusOfApp={statusOfApp} artisan={userInfoContext.userInfo} />
        </View>
        <ScrollView style={styles.container}>
          <Text style={styles.titleText}>Dashboard</Text>

          <TouchableOpacity onPress={handleToggleAvailability}>
            <View style={[styles.availabilityStyle, {backgroundColor: isEnabled ? kcraftek_color:'#dbdbdb'}]}>
              <Text style={[styles.statusText, {color: isEnabled ? 'white': kcraftek_color}]}>Status: {artisanStatus()}</Text>
              <Text style={[styles.tapToChange, {color: isEnabled ? 'white' : kcraftek_color}]}>Tap to Change!</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.dashboardCard}>
            <Text style={styles.dashboardCardText}>Occupation: {userInfoContext.userInfo.occupations}</Text>
          </View>

          <View style={styles.dashboardCard}>
            <Text style={styles.dashboardCardText}>Job Completed: 0</Text>
          </View>
          <View style={styles.dashboardCard}>
            <Text style={styles.dashboardCardText}>Average Rating</Text>
            <Stars />
          </View>
          <View style={styles.dashboardCard}>
            <Text style={[styles.dashboardCardText,{fontSize: 25, fontWeight: 'bold'}]}>Total Earned: GHC 0.00</Text>
          </View>
          <TouchableOpacity style={[styles.dashboardCard,{backgroundColor: 'red'}]} onPress={handlePress}>
            <Text style={styles.buttonText}>Log Out</Text>
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Your Services are being requested! Show Request Information?</Text>
                <View style={styles.buttonLayout}>
                  <Pressable
                              style={styles.button}
                              onPress={() => _previewRequestInfo() }
                  >
                      <Text style={styles.textStyle}>Yes</Text>
                  </Pressable>
                  <Pressable
                      style={styles.button}
                      onPress={() => _no() }
                  >
                      <Text style={styles.textStyle}>No</Text>
                  </Pressable>  
                </View>
              </View>
            </View>
          </Modal>
    </View>
    </View>
  )
}

const styles = StyleSheet.create({
  availabilityStyle: {
    height: 80,
    margin: 10,    
    alignContent: 'center',
    justifyContent: 'center'
  },  
  button: {
    width: 80,
    padding: 5,
    margin: 5,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    alignSelf: 'center',
  },
  buttonLayout: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignContent:'center'
  },
  buttonText: {
    fontSize:20,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  container: {
    //height: '100%',
    width: '100%',
    backgroundColor: 'white'
  },
  dashboardCard: {
    height: 80,
    margin: 10,    
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: kcraftek_color
  },
  dashboardCardContainer:{
    padding: 10,
    flex: 1,
    flexDirection: 'row'
  },
  dashboardCardText: {
    color:'white',
    fontSize: 18,
    marginLeft: 10
  },
  headPanel: {
    marginTop: 20,
    height: "20%"
  },
  headPanelText: {    
    fontSize: 24,
    padding: 5,
    marginTop: 25
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18
  },
  modalView: {
    margin: 10,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  
  statusText:{
    fontSize: 18,
    marginLeft: 10
  },
  tapToChange:{
    alignSelf: 'flex-end', 
    color:'white',
    marginRight:10
  }, 
  text: {
    textAlign: 'center',
    fontSize: 20,
    fontStyle: 'italic',
    marginTop: '2%',
    marginBottom: '10%',
    fontWeight: 'bold',
    color: 'black',
  },
  textStyle:{
    alignSelf: 'center'
  },
  titleText: {
    textAlign: 'left',
    fontSize: 28,
    fontWeight: 'bold',
    color: kcraftek_color,
    marginLeft: 15
  }
});