import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useAuth } from '../../context/AuthContext';



const ProfileScreen = () => {
  // ✅ Call useAuth() at the top level
  const { user,logout } = useAuth();

  const handleLogout = async () => {
    await logout();  // clears tokens + updates context
    console.log("User logged out");
    // Navigation will auto-switch to AuthStack if you set it up like:
    // {isLoggedIn ? <AppStack /> : <AuthStack />}
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Profile Info */}
      <View style={styles.profileSection}>
        <Image
          source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.role}>Farmer</Text>
        <Text style={styles.joined}>Joined 2022</Text>
      </View>

      {/* Help & Contact */}
      <TouchableOpacity style={styles.option}>
        <View style={styles.iconBox}>
          <Text style={styles.icon}>?</Text>
        </View>
        <Text style={styles.optionText}>Help & Contact</Text>
      </TouchableOpacity>

      {/* Spacer */}
      <View style={{ flex: 1 }} />

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 12,
  },
  role: {
    fontSize: 14,
    color: 'gray',
  },
  joined: {
    fontSize: 14,
    color: 'gray',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 10,
    marginTop: 30,
  },
  iconBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  icon: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  optionText: {
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
