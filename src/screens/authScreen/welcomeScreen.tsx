import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/rootStackParamList';

type WelcomeScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'welcomeScreen'>;
const WelcomeScreen = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/svg/farmIcon.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>FarmGuard</Text>
      <Text style={styles.subtitle}>Smart Protection for Your Farm</Text>

      <View style={{ flex: 1 }} />

      <TouchableOpacity
        style={styles.signupButton}
        onPress={() => navigation.navigate('SignUpScreen')}
      >
        <Text style={styles.signupText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.signinButton}
        onPress={() => navigation.navigate('LoginScreen')}
      >
        <Text style={styles.signinText}>Sign In</Text>
      </TouchableOpacity>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  logo: {
    width: 80,
    height: 80,
    marginTop: 80,
  },
  title: {
    marginTop: 20,
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
  },
  subtitle: {
    marginTop: 10,
    fontSize: 24,
    color: '#666666',
  },
  signupButton: {
    backgroundColor: '#00C200',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 32,
    alignItems: 'center',
    marginBottom: 12,
  },
  signinButton: {
    backgroundColor: '#F0F0F0',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 32,
    alignItems: 'center',
    marginBottom: 30,
  },
  signupText: {
    color: '#050505ff',
    fontSize: 16,
    fontWeight: '600',
  },
  signinText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
});
