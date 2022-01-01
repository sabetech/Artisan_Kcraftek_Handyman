import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ImageBackground } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {signIn} from '../../api/firebase_functions';

const kcraftek_color = "hsla(120, 60%, 26%, 1)";

export default function SignIn({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handlePress = () => {
    if (!email) {
      Alert.alert('Email field is required.');
    }

    if (!password) {
      Alert.alert('Password field is required.');
    }

    signIn(email, password);
    setEmail('');
    setPassword('');
    navigation.navigate('Loading');
  };

  return (
    <ImageBackground
      style={styles.background}
      source={require('../../assets/background.png')}>
    <View style={styles.container}>
      <Text style={styles.text}>Sign in to your Kcraftek account:</Text>

      <TextInput
        style={styles.formInput}
        placeholder="Enter your email"
        value={email}
        onChangeText={(email) => setEmail(email)}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.formInput}
        placeholder="Enter your password"
        value={password}
        onChangeText={(password) => setPassword(password)}
        secureTextEntry={true}
      />

      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>

      <Text
          style={styles.text}
      >
          Don't have an account? <Text style={[styles.text, styles.link]} onPress={() => navigation.navigate("Sign Up")}>Register Now</Text>
      </Text>

    </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: 300,
    padding: 5,
    backgroundColor: '#1b6a1b',
    elevation: 5,
    paddingVertical: 10,
    borderRadius: 15,
    alignSelf: 'center',
    margin: '5%',
  },
  buttonText: {
    fontSize:20,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 5
  },
  container: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formInput: {
    width: 300,
    fontSize:18,
    borderWidth: 1,
    borderColor:'#1b6a1b',
    padding: 10,
    margin: 5,
  },
  text: {
    textAlign: 'center',
    fontSize: 15,
    margin: 10,
    fontWeight: 'bold',
    color: '#1b6a1b',
  },
  link: {
    color: kcraftek_color,
    fontSize: 15,
    fontWeight: "500"
}
});