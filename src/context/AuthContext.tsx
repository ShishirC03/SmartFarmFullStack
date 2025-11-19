// import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
// import { saveTokens, getAccessToken, getRefreshToken, clearTokens } from '../utils/storage';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// type AuthContextType = {
//   isLoggedIn: boolean;
//   login: (accessToken: string, refreshToken: string) => Promise<void>;
//   logout: () => Promise<void>;
// };

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   useEffect(() => {
//     (async () => {
//       const token = await getAccessToken();
//       setIsLoggedIn(!!token);
//     })();
//   }, []);

//   const login = async (accessToken: string, refreshToken: string) => {
//     await saveTokens(accessToken, refreshToken);
//     setIsLoggedIn(true);
//   };

//    const logout = async () => {
//     await AsyncStorage.removeItem("accessToken");
//     await AsyncStorage.removeItem("refreshToken");
//     setIsLoggedIn(false);
//   };


//   return (
//     <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error('useAuth must be used within AuthProvider');
//   return context;
// };


import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveTokens, getAccessToken, getRefreshToken, clearTokens } from '../utils/storage';

type UserType = {
  id: string;
  name: string;
  email: string;
} | null;

type AuthContextType = {
  isLoggedIn: boolean;
  user: UserType;
  login: (accessToken: string, refreshToken: string, user: UserType) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserType>(null);

  useEffect(() => {
    (async () => {
      const token = await getAccessToken();
      const userData = await AsyncStorage.getItem('user');
      if (userData) setUser(JSON.parse(userData));
      setIsLoggedIn(!!token);
    })();
  }, []);

  const login = async (accessToken: string, refreshToken: string, userData: UserType) => {
    await saveTokens(accessToken, refreshToken);
    if (userData) {
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    }
    setIsLoggedIn(true);
  };

  const logout = async () => {
    await clearTokens();
    await AsyncStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
