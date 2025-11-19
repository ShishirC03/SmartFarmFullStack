import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

interface HeaderProps {
  title: string;
  avatarUri: string;
  onAvatarPress?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, avatarUri, onAvatarPress }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onAvatarPress} activeOpacity={0.7}>
        <Image source={{ uri: avatarUri }} style={styles.avatar} />
      </TouchableOpacity>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>
      {/* Placeholder to balance layout */}
      <View style={styles.rightSpace} />
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  rightSpace: {
    width: 36, // same as avatar width to keep title centered
  },
});
