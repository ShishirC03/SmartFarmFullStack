// storage/tokenUtils.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const ACCESS_KEY = 'accessToken';
const REFRESH_KEY = 'refreshToken';

export const saveTokens = async (accessToken: string, refreshToken: string) => {
  try {
    await AsyncStorage.multiSet([[ACCESS_KEY, accessToken], [REFRESH_KEY, refreshToken]]);
  } catch (e) {
    console.error('saveTokens error', e);
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  try { return await AsyncStorage.getItem(ACCESS_KEY); } catch (e) { return null; }
};
export const getRefreshToken = async (): Promise<string | null> => {
  try { return await AsyncStorage.getItem(REFRESH_KEY); } catch (e) { return null; }
};

export const clearTokens = async () => {
  try { await AsyncStorage.multiRemove([ACCESS_KEY, REFRESH_KEY]); } catch (e) { console.error(e); }
};

