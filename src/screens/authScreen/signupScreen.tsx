import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/rootStackParamList';

type SignUpScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'SignUpScreen'
>;

const SignUpScreen = () => {
  const navigation = useNavigation<SignUpScreenNavigationProp>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  

  const handleContinue = async () => {
  if (name.length === 0) {
    Alert.alert("Please enter your name");
  }else if (email !== email.toLowerCase()) {
    Alert.alert("Please enter your email in all lowercase letters");
    return;
  } 
  else if (!/\S+@\S+\.\S+/.test(email)) {
    Alert.alert("Please enter a valid email address");
  } else {
    try {
      // ✅ Call backend signup route
      const response = await fetch("http://10.0.2.2:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("OTP sent to your email!");
        // ✅ move to OTP screen and pass email
        navigation.navigate("OtpVerificationScreen", { email, type: "signup" });
      } else {
        Alert.alert(data.error || "Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      Alert.alert("Something went wrong. Please try again.");
    }
  }
};

  
  return (
    <View style={styles.container}>
      <Text style={styles.appTitle}>FarmGuard</Text>
      <Text style={styles.welcome}>Create Your FarmGuard Account</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        placeholderTextColor="#999"
        value={name}
        onChangeText={setName}
      />

      {/* ✅ Mobile number input replace with email input */}
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        placeholderTextColor="#999"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Send OTP</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignUpScreen;

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
    fontSize: 24,
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
    marginBottom: 20,
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
