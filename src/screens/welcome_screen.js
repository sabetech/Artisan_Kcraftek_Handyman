import {ImageBackground, StyleSheet, View, Text, TouchableOpacity, Image} from 'react-native';
import React from 'react';


export default function WelcomeScreen ({navigation}) {
  return (
     <ImageBackground
      style={styles.background}
      source={require('../../assets/background.png')}>
        
        <Image source={require("../../assets/kcraftek_logo.png")} style={{width: 110, height: 90, position: 'absolute', top: 60}}/>
        
      <View style={styles.titleContainer}>
          
        <Text style={styles.title}>Welcome</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Sign Up')} >
        <Text style={styles.buttonText}>Sign Up</Text>
       </TouchableOpacity>
      <Text style={styles.inlineText}>Already have an account?</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Sign In')}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
     </ImageBackground>
  )
}

const styles = StyleSheet.create({
    background: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    button: {
      width: '75%',
      borderRadius: 15,
      elevation: 5,
      backgroundColor: '#1b6a1b',
      padding: 5,
      margin: '2%',
      marginTop: 30
    },
    buttonText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: 'white',
      textAlign: 'center',
      paddingVertical: 10
    },
    inlineText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#1b6a1b',
      textAlign: 'center',
      marginTop: '10%',
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#1b6a1b',
      textAlign: 'center'
    },
    titleContainer: {
      position: 'absolute',
      top: 200
    },
  });