import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import BackArrow from '../../assets/svg/BackArrow';
import { useNavigation } from '@react-navigation/native';

const ReconnectDeviceScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackArrow />
        </TouchableOpacity>
        <Text style={styles.headerText}>Device Setup</Text>
      </View>

      {/* Devices List */}
      <View style={styles.deviceBox}>
        <Text style={styles.deviceTitle}>ESP32</Text>
        <Text style={styles.status}>Connected</Text>
      </View>

      <View style={styles.deviceBox}>
        <Text style={styles.deviceTitle}>Camera</Text>
        <Text style={styles.status}>Connected</Text>
      </View>

      {/* Buttons */}
      <TouchableOpacity style={styles.reconnectBtn}>
        <Text style={styles.reconnectText}>Reconnect</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.addDeviceBtn}>
        <Text style={styles.addDeviceText}>Add New Device</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ReconnectDeviceScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  headerText: { flex: 1, textAlign: 'center', fontSize: 16, fontWeight: '600' },
  deviceBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  deviceTitle: { fontSize: 16, fontWeight: '500' },
  status: { color: 'green' },
  reconnectBtn: {
    marginTop: 30,
    padding: 14,
    borderRadius: 25,
    backgroundColor: 'limegreen',
    alignItems: 'center',
  },
  reconnectText: { color: '#fff', fontWeight: '600' },
  addDeviceBtn: {
    marginTop: 15,
    padding: 14,
    borderRadius: 25,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
  },
  addDeviceText: { fontWeight: '600', color: '#555' },
});
