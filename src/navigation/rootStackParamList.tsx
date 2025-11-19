export type AuthStackParamList = {
  welcomeScreen: undefined;
  SignUpScreen: undefined;
  LoginScreen: undefined;
    OtpVerificationScreen: { 
    email: string; 
    type: "signup" | "signin"; 
  };
  HomeScreen: undefined;
};

// export type MainStackParamList = {
//   DashboardScreen: undefined;
//   LiveFeedScreen: undefined;
//   AnalyticsScreen: undefined;
//   ProfileScreen: undefined;
//   SettingsScreen: undefined;
//   ReconnectDeviceScreen: undefined;
//   DetectionDetail: { id: string };
// };
export type MainStackParamList = {
  DashboardScreen: undefined;
  LiveFeedScreen: undefined;
  AnalyticsScreen: undefined;
  ProfileScreen: undefined;
  SettingsScreen: undefined;
  ReconnectDeviceScreen: undefined;
  DetectionDetail: { id: string };

  // Add these so navigation.navigate('History') or navigate('DetectionHistory') is valid:
  History?: undefined;
  DetectionHistory?: undefined;
};

export type BottomTabParamList = {
  Home: undefined;
  DetectionHistory: undefined;
  Profile: undefined;
};
