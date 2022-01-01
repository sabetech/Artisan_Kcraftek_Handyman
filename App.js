import { StatusBar } from 'expo-status-bar';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import * as firebase from 'firebase';
import apiKeys from './config/keys';
import WelcomeScreen from './src/screens/welcome_screen';
import SignUp from './src/screens/signup_screen';
import SignIn from './src/screens/signin_screen';
import LoadingScreen from './src/screens/loading_screen';
import Dashboard from './src/screens/dashboard_screen';
import { UserProvider } from './src/contexts/UserContext';

import React from 'react';


const Stack = createStackNavigator();
export default function App() {

  if (!firebase.apps.length) {
    console.log('Connected with Firebase')
    firebase.initializeApp(apiKeys.firebaseConfig);
  }

  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator>
        <Stack.Screen name={'Loading'} component={LoadingScreen} options={{ headerShown: false }}/>
        <Stack.Screen name='Home' component={WelcomeScreen} options={{ headerShown: false }}/>
        <Stack.Screen name='Sign Up' component={SignUp} options={{ headerShown: false }}/>
        <Stack.Screen name='Sign In' component={SignIn} options={{ headerShown: false }}/>
        <Stack.Screen name={'Dashboard'} component={Dashboard} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}

