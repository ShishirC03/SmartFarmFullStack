import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../../screens/authScreen/loginScreen';
import OtpVerificationScreen from '../../screens/authScreen/otpVerificationScreen';
import { AuthStackParamList } from '../rootStackParamList'; 
import WelcomeScreen from '../../screens/authScreen/welcomeScreen';
import signupScreen from '../../screens/authScreen/signupScreen';

const Stack = createStackNavigator<AuthStackParamList>(); 

const AuthStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="welcomeScreen" component={WelcomeScreen} />
      <Stack.Screen name="SignUpScreen" component={signupScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="OtpVerificationScreen" component={OtpVerificationScreen} />
    </Stack.Navigator>
  );
};

export default AuthStackNavigator;
