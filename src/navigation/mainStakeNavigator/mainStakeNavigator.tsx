import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DashboardScreen from '../../screens/dashboardScreen/dashboardScreen';
import ProfileScreen from '../../screens/ProfileScreen/profileScreen';
import LiveFeedScreen from '../../screens/livefeedScreen/liveFeedScreen';
import SettingsScreen from '../../screens/settingScreen/settingScreen';
import ReconnectDeviceScreen from '../../screens/reconnectDeviceScreen/reconnectDeviceScreen';

export type MainStackParamList = {
  DashboardScreen: undefined;
  ProfileScreen: undefined;
  LiveFeedScreen: undefined;
  ReconnectDeviceScreen: undefined;
  SettingsScreen: undefined;
};

const Stack = createNativeStackNavigator<MainStackParamList>();

const MainStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DashboardScreen" component={DashboardScreen} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="LiveFeedScreen" component={LiveFeedScreen} />
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
      <Stack.Screen
        name="ReconnectDeviceScreen"
        component={ReconnectDeviceScreen}
      />
    </Stack.Navigator>
  );
};

export default MainStackNavigator;
