import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/rootStackParamList';

type LoginScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'LoginScreen'
>;

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState('');

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSendOtp = async () => {
    if (validateEmail(email)) {
      try {
        // ⭐ added: call backend /signin
        const res = await fetch("http://10.0.2.2:5000/api/auth/signin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        const data = await res.json();

        if (!res.ok) {
          Alert.alert("Error", data.error || "Something went wrong");
          return;
        }

        Alert.alert("Success", "OTP sent to your email!");

        // ⭐ same as before, navigate to OTP screen
        navigation.navigate("OtpVerificationScreen", { email, type: "signin" });


      } catch (err) {
        Alert.alert("Error", "Network error, try again later");
      }
    } else {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.appTitle}>FarmGuard</Text>
      <Text style={styles.welcome}>Welcome Back to FarmGuard</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your email address"
        placeholderTextColor="#999"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TouchableOpacity style={styles.button} onPress={handleSendOtp}>
        <Text style={styles.buttonText}>Send OTP</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333333',
  },
  welcome: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
    color: '#333333',
  },
  input: {
    width: '100%',
    height: 48,
    borderRadius: 8,
    backgroundColor: '#F2F4F3',
    paddingHorizontal: 16,
    marginBottom: 24,
    fontSize: 16,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#00E200',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    color: '#000000ff',
    fontWeight: '600',
    fontSize: 16,
  },
});
