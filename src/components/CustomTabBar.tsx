import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

// Import your SVG icons
import HomeIcon from '../assets/svg/HomeIcon';
import ClockIcon from '../assets/svg/ClockIcon';
import SettingIcon from '../assets/svg/SettingsIcon';

const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.tabBarContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true, // ✅ FIXED
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const renderIcon = () => {
          const fillColor = isFocused ? '#00E200' : '#9CA3AF';

          switch (route.name) {
            case 'Home':
              return <HomeIcon fill={fillColor} />;
            case 'History':
              return <ClockIcon fill={fillColor} />;
            case 'Settings':
              return <SettingIcon fill={fillColor} />;
            default:
              return null;
          }
        };

        return (
          <TouchableOpacity key={route.key} onPress={onPress} style={styles.tabItem}>
            {renderIcon()}
            <Text style={[styles.label, { color: isFocused ? '#00E200' : '#9CA3AF' }]}>
              {route.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    height: 70,
    backgroundColor: '#FFFFFF',
    borderTopColor: '#E5E7EB',
    borderTopWidth: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default CustomTabBar;
