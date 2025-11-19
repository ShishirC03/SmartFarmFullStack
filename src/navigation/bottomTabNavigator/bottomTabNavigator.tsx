import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MainStackNavigator from '../mainStakeNavigator/mainStakeNavigator';
import DetectionHistoryScreen from '../../screens/detectionHistoryScreen/detectionHistoryScreen';
import SettingScreen from '../../screens/settingScreen/settingScreen';
import CustomTabBar from '../../components/CustomTabBar';

export type BottomTabParamList = {
  Home: undefined;
  History: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      {/* Home tab me pura MainStackNavigator */}
      <Tab.Screen name="Home" component={MainStackNavigator} />
      <Tab.Screen name="History" component={DetectionHistoryScreen} />
      <Tab.Screen name="Settings" component={SettingScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
