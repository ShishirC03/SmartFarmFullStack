import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AuthStackNavigator from './authStakeNavigator/authStakeNavigator';
import BottomTabNavigator from './bottomTabNavigator/bottomTabNavigator';
import ReconnectDeviceScreen from '../screens/reconnectDeviceScreen/reconnectDeviceScreen';
import { useAuth } from '../context/AuthContext';

// RootStack types
export type RootStackParamList = {
  Auth: undefined;
  MainApp: undefined;
  ReconnectDeviceScreen: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const { isLoggedIn } = useAuth();

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {!isLoggedIn ? (
          <RootStack.Screen name="Auth" component={AuthStackNavigator} />
        ) : (
          <RootStack.Screen name="MainApp" component={BottomTabNavigator} />
        )}

        {/* ✅ Yeh hamesha accessible hoga */}
        <RootStack.Screen
          name="ReconnectDeviceScreen"
          component={ReconnectDeviceScreen}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
