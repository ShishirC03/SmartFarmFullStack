import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface AlertCardProps {
  count: number;
}

const AlertCard: React.FC<AlertCardProps> = ({ count }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>Today's Alerts</Text>
      <Text style={styles.count}>{count}</Text>
    </View>
  );
};

export default AlertCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F3F5F3',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    height: 110,
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
  count: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 4,
  },
});
