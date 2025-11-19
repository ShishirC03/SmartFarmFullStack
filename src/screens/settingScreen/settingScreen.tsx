import React, { useState } from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import Slider from '@react-native-community/slider';
import {
  CompositeNavigationProp,
  useNavigation,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { MainStackParamList } from '../../navigation/mainStakeNavigator/mainStakeNavigator';
import { BottomTabParamList } from '../../navigation/bottomTabNavigator/bottomTabNavigator';

// ✅ Navigation type fix
type SettingsScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<BottomTabParamList, 'Settings'>,
  NativeStackNavigationProp<MainStackParamList>
>;

const SettingsScreen = () => {
  const [autoScare, setAutoScare] = useState(false);
  const [volume, setVolume] = useState(75);
  const [scareDuration, setScareDuration] = useState(5);
  const [cooldownTime, setCooldownTime] = useState(30);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [silentMode, setSilentMode] = useState(false);

  const navigation = useNavigation<SettingsScreenNavigationProp>();

  const handleTestVolume = () => {
    Alert.alert('Test Volume', `Playing scare sound at ${volume}% volume`);
  };

  const handleReconnectDevice = () => {
    navigation.navigate('ReconnectDeviceScreen');
  };

  const handleTestDevice = () => {
    Alert.alert('Test Device', 'Testing scare system...');
  };

  const handleSaveChanges = () => {
    Alert.alert('Settings Saved', 'Your preferences have been updated.');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>Scare Settings</Text>

      {/* Auto Scare */}
      <View style={styles.row}>
        <View>
          <Text style={styles.title}>Auto Scare</Text>
          <Text style={styles.subtitle}>
            Automatically scare animals when detected
          </Text>
        </View>
        <Switch value={autoScare} onValueChange={setAutoScare} />
      </View>

      {/* Scare Sound */}
      <Text style={styles.sectionTitle}>Scare Sound</Text>
      <View style={styles.sliderRow}>
        <Text style={styles.subtitle}>Scare Sound Volume {volume}%</Text>
      </View>
      <Slider
        style={{ width: '100%' }}
        minimumValue={0}
        maximumValue={100}
        step={1}
        value={volume}
        onValueChange={setVolume}
      />
      <TouchableOpacity style={styles.buttonSmall} onPress={handleTestVolume}>
        <Text>Test Volume</Text>
      </TouchableOpacity>

      {/* Scare Timing */}
      <Text style={styles.sectionTitle}>Scare Timing</Text>
      <Text style={styles.subtitle}>Scare Duration {scareDuration}s</Text>
      <Slider
        minimumValue={1}
        maximumValue={10}
        step={1}
        value={scareDuration}
        onValueChange={setScareDuration}
      />
      <Text>Cooldown Time {cooldownTime}s</Text>
      <Slider
        minimumValue={10}
        maximumValue={60}
        step={1}
        value={cooldownTime}
        onValueChange={setCooldownTime}
      />

      {/* Notification Preferences */}
      <Text style={styles.sectionTitle}>Notification Preferences</Text>
      <View style={styles.row}>
        <View>
          <Text style={styles.title}>Push Notifications</Text>
          <Text style={styles.subtitle}>
            Receive notifications when animals are detected
          </Text>
        </View>
        <Switch
          value={pushNotifications}
          onValueChange={setPushNotifications}
        />
      </View>
      <View style={styles.row}>
        <View>
          <Text style={styles.title}>Silent Mode</Text>
          <Text style={styles.subtitle}>
            Silence notifications during specific hours
          </Text>
        </View>
        <Switch value={silentMode} onValueChange={setSilentMode} />
      </View>

      {/* Device Configuration */}
      <Text style={styles.sectionTitle}>Device Configuration</Text>
      <Text>Device Status: Connected</Text>
      <View style={styles.rowButtons}>
        <TouchableOpacity
          style={styles.buttonSmall}
          onPress={handleReconnectDevice}
        >
          <Text>Reconnect Device</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonSmall} onPress={handleTestDevice}>
          <Text>Test Device</Text>
        </TouchableOpacity>
      </View>

      {/* Save Changes */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sliderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#618A61',
  },
  rowButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  buttonSmall: {
    backgroundColor: '#b8e6c2ff',
    padding: 10,
    borderRadius: 8,
    width: 114,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#00d33d',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#000000ff',
    fontWeight: '600',
  },
});
