import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface ActionButtonProps {
  text: string;
  backgroundColor: string;
  onPress: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  text,
  backgroundColor,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor }]}
      onPress={onPress}
    >
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
};

export default ActionButton;

const styles = StyleSheet.create({
  button: {
    padding: 14,
    borderRadius: 50,
    alignItems: 'center',
    marginBottom: 12,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000ff',
  },
});
