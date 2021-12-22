import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, Switch} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as firebase from 'firebase';
import {loggingOut} from '../../api/firebase_functions';
import Stars from './rating_stars';

export default function Dashboard({ navigation }) {
  const [fullname, setFirstName] = useState('');
  let currentUserUID = firebase.auth().currentUser.uid;
  

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
          setFirstName(dataObj.name)
        }
      } catch (err){
      Alert.alert('There is an error.', err.message)
      }
    }
    getUserInfo();
  })

  const handlePress = () => {
    loggingOut();
    navigation.replace('Home');
  };

  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  return (
    <View style={styles.container}>
      <StatusBar />
      <View style={styles.headPanel}>
        <Text style={styles.headPanelText}>Hi {fullname && fullname.split(' ')[0]}</Text>
      </View>
      <Text style={styles.titleText}>Dashboard</Text>
      <View style={styles.dashboardCard1}>
        <Text style={styles.statusText}>Status: {isEnabled ? 'Available' : 'Offline'}
          <Switch
            trackColor={{ false: "#767577", true: "brown" }}
            thumbColor={isEnabled ? "#1b6a1b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </Text>
      </View>
      <View style={styles.dashboardCard1}>
        <Text style={styles.statusText}>Job Completed: 0</Text>
      </View>
      <View style={[styles.dashboardCard1, {height: 120}]}>
        <Text style={styles.statusText}>Rating</Text>
        <Stars />
      </View>
      {/* <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity> */}
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    width: 150,
    padding: 5,
    backgroundColor: '#ff9999',
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 15,
    alignSelf: 'center',
  },
  dashboardCard1: {
    borderWidth: .5,
    borderRadius: 5,
    borderColor: 'grey',
    height: 80,
    elevation: 3,
    margin: 10,
    overflow: 'hidden',
    backgroundColor: 'white'
  },  
  statusText:{
    fontSize: 24,
    
  },
  dashboardCardContainer:{
    padding: 10,
    flex: 1,
    flexDirection: 'row'
  },
  headPanel: {
    backgroundColor: "#1b6a1b",
    marginTop: 20,
    height: "20%"
  },
  headPanelText: {
    color:'white',
    fontSize: 32,
    padding: 5,
    marginTop: 20
  },
  buttonText: {
    fontSize:20,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: '#FFF',
    //alignItems: 'center',
    //justifyContent: 'center',
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
  titleText: {
    textAlign: 'left',
    fontSize: 30,
    fontWeight: 'bold',
    color: '#2E6194',
  },
});