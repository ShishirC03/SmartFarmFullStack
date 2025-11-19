import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { saveTokens } from '../../utils/storage';// adjust path

import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/rootStackParamList';
import ProductHeader from '../../components/ProductHeader';
import { useAuth } from '../../context/AuthContext';

type OtpVerificationRouteProp = RouteProp<
  AuthStackParamList,
  'OtpVerificationScreen'
>;
type OtpVerificationNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'OtpVerificationScreen'
>;

const OtpVerificationScreen = () => {
  const navigation = useNavigation<OtpVerificationNavigationProp>();
  const route = useRoute<OtpVerificationRouteProp>();

  // ✅ now we accept both email and type (signup | signin)
  const { email, type } = route.params;

  const { login } = useAuth();

  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const inputs = useRef<Array<TextInput | null>>([]);

  const handleChange = (text: string, index: number) => {
    if (!/^\d*$/.test(text)) return;
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

const handleVerify = async () => {
  const fullOtp = otp.join('');
  if (fullOtp.length !== 6) {
    Alert.alert('Please enter the 6-digit OTP');
    return;
  }

  try {
    // ✅ Choose endpoint dynamically
    const endpoint =
      type === 'signup'
        ? 'http://10.0.2.2:5000/api/auth/signup/verify'
        : 'http://10.0.2.2:5000/api/auth/signin/verify';

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        otp: fullOtp,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      Alert.alert("✅ OTP Verified Successfully!");

      // ✅ Save both tokens + navigate
      if (data.accessToken && data.refreshToken && data.user) {
        // login expects two arguments: accessToken and refreshToken
        await login(data.accessToken, data.refreshToken,data.user);
        // if you need to store user info, handle data.user separately here
        navigation.replace("HomeScreen"); // go to home after login
      }
    } else {
      // backend sends "error" on failure
      Alert.alert(data.error || data.message || 'OTP Verification Failed');
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    Alert.alert('Something went wrong. Please try again.');
  }
};


  return (
    <KeyboardAvoidingView
      style={styles.flex1}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <ProductHeader title="Verification" />

        <Text style={styles.subTitle}>Enter the code</Text>
        <Text style={styles.description}>
          We sent a verification code to your email address. Please enter it
          below to continue.
        </Text>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={`otp-${index}`}
              ref={ref => {
                inputs.current[index] = ref;
              }}
              style={styles.otpInput}
              keyboardType="number-pad"
              maxLength={1}
              onChangeText={text => handleChange(text, index)}
              value={digit}
              autoFocus={index === 0}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.verifyButton} onPress={handleVerify}>
          <Text style={styles.verifyText}>Verify</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default OtpVerificationScreen;

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
  },
  subTitle: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'left',
    marginBottom: 8,
    color: '#000',
  },
  description: {
    color: '#666',
    fontSize: 18,
    textAlign: 'left',
    marginBottom: 32,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  otpInput: {
    width: 48,
    height: 58,
    borderWidth: 1.5,
    borderColor: '#000',
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  verifyButton: {
    height: 48,
    width: 358,
    backgroundColor: '#00E200',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: 40,
  },
  verifyText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
});


