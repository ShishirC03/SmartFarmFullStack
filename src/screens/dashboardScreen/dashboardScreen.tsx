// src/screens/dashboardScreen.tsx
import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  ScrollView,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  TouchableOpacity,
  Animated,
} from 'react-native';
import Header from '../../components/Header';
import DetectionCard from '../../components/DetectionCard';
import AlertCard from '../../components/AlertCard';
import ActionButton from '../../components/ActionButton';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigation/rootStackParamList';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { imageUrl } from '../../utils/api'; // adjust path if needed
import { io } from 'socket.io-client';

type DashboardNavProp = NativeStackNavigationProp<
  MainStackParamList,
  'DashboardScreen'
>;

const BASE_URL = 'http://10.0.2.2:5000'; // adjust if needed
const LIVE_BADGE_DURATION = 2000; // ms

const DashboardScreen: React.FC = () => {
  const navigation = useNavigation<DashboardNavProp>();

  const [user, setUser] = useState<any | null>(null);
  const [todayCount, setTodayCount] = useState<number>(0);
  const [latestDetection, setLatestDetection] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Animated badge value (1 -> visible, 0 -> hidden)
  const liveOpacity = useRef(new Animated.Value(0)).current;
  const liveTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const stored = await AsyncStorage.getItem('user');
        if (stored) setUser(JSON.parse(stored));
      } catch (err) {
        console.warn('Failed to load user from AsyncStorage', err);
      }
    };
    loadUser();
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Parallel requests: today count and latest detection
      const [countRes, latestRes] = await Promise.all([
        fetch(`${BASE_URL}/api/detections/today`),
        fetch(`${BASE_URL}/api/detections/latest-file`),
      ]);

      if (!countRes.ok) {
        throw new Error(`today endpoint failed: ${countRes.status}`);
      }
      if (!latestRes.ok && latestRes.status !== 404) {
        // allow 404 for latest (means no image yet)
        throw new Error(`latest endpoint failed: ${latestRes.status}`);
      }

      const countJson = await countRes.json().catch(() => ({}));
      const latestJson = await latestRes.json().catch(() => null);

      setTodayCount(Number(countJson.todayCount || 0));

      // latest endpoint returns the detection info inside `detection` or similar
      const latestItem = latestJson?.detection || latestJson?.item || latestJson || null;

      // normalize imagePath -> always produce a string URL for imageUri prop
      let normalizedLatest = null;
      if (latestItem) {
        const imagePath =
          latestItem.imagePath ||
          (latestItem.imageUrl ? latestItem.imageUrl.replace(`${BASE_URL}`, '') : null);
        const imageUri = imagePath ? (imagePath.startsWith('http') ? imagePath : `${BASE_URL}${imagePath}`) : '';
        normalizedLatest = { ...latestItem, imagePath, imageUri };
      }
      setLatestDetection(normalizedLatest);
    } catch (err: any) {
      console.warn('Fetch dashboard data error:', err);
      setError(err?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- live updates: listen for animalDetected and update latestDetection & todayCount ---
  useEffect(() => {
    const SOCKET_URL = BASE_URL;
    const socket = io(SOCKET_URL, { transports: ['websocket'] });

    socket.on('connect', () => {
      console.log('Dashboard socket connected', socket.id);
    });

    socket.on('animalDetected', (payload: any) => {
      try {
        const raw = payload?.detection ?? payload ?? null;
        if (!raw) return;

        const imagePath =
          raw.imagePath ?? (raw.imageUrl ? raw.imageUrl.replace(`${BASE_URL}`, '') : null);
        const imageUri = imagePath ? (imagePath.startsWith('http') ? imagePath : `${BASE_URL}${imagePath}`) : '';

        const normalized = {
          ...raw,
          imagePath,
          imageUri,
          timestamp: raw.timestamp ?? raw.createdAt ?? new Date().toISOString(),
        };

        setLatestDetection(normalized);
        // increment today's count safely
        setTodayCount(prev => (typeof prev === 'number' ? prev + 1 : 1));
      } catch (err) {
        console.warn('Error handling animalDetected', err);
      }
    });

    socket.on('disconnect', () => console.log('Dashboard socket disconnected'));
    socket.on('connect_error', (err: any) => console.warn('Dashboard socket connect_error', err?.message || err));

    return () => {
      socket.disconnect();
    };
  }, []);

  // Trigger LIVE badge animation whenever latestDetection changes
  useEffect(() => {
    if (!latestDetection) return;
    // clear any previous timeout or animation
    if (liveTimeoutRef.current) {
      clearTimeout(liveTimeoutRef.current);
      liveTimeoutRef.current = null;
    }

    // set opacity to 1 instantly, then fade to 0 over LIVE_BADGE_DURATION
    liveOpacity.setValue(1);
    Animated.timing(liveOpacity, {
      toValue: 0,
      duration: LIVE_BADGE_DURATION,
      useNativeDriver: true,
    }).start();

    // fallback: ensure value set to 0 after duration
    liveTimeoutRef.current = setTimeout(() => {
      liveOpacity.setValue(0);
      liveTimeoutRef.current = null;
    }, LIVE_BADGE_DURATION + 50) as unknown as number;
  }, [latestDetection, liveOpacity]);

  // safe values for DetectionCard props (ensure strings)
  const latestTimeStr = latestDetection
    ? new Date(latestDetection.timestamp || latestDetection.createdAt || Date.now()).toLocaleString()
    : '';
  const latestTypeStr =
    latestDetection && Array.isArray(latestDetection.detections) && latestDetection.detections.length > 0
      ? latestDetection.detections[0].label || 'Unknown'
      : 'Unknown';
  const latestDescription = `Count: ${latestDetection?.count ?? (latestDetection?.detections?.length ?? 0)}`;
  const latestImageUri = typeof latestDetection?.imageUri === 'string' ? latestDetection.imageUri : '';

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>
      <Header
        title="Dashboard"
        avatarUri="https://randomuser.me/api/portraits/men/32.jpg"
        onAvatarPress={() => navigation.navigate('ProfileScreen')}
      />

      <Text style={styles.welcome}>Welcome, Farmer {user?.name ?? 'Friend'}</Text>

      {loading ? (
        <View style={{ marginTop: 16, alignItems: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <>
          <AlertCard count={todayCount} />

          {latestDetection ? (
            <View style={{ marginTop: 16 }}>
              <Text style={styles.sectionTitle}>Latest Detection</Text>

              <View style={{ position: 'relative' }}>
                {/* LIVE badge - absolute positioned top-right of the card */}
                <Animated.View
                  pointerEvents="none"
                  style={[
                    styles.liveBadge,
                    { opacity: liveOpacity, transform: [{ scale: liveOpacity.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] }) }] },
                  ]}
                >
                  <Text style={styles.liveText}>LIVE</Text>
                </Animated.View>

                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => {
                    // Navigate to detail if you have a DetectionDetail screen, otherwise open History
                    if (latestDetection && latestDetection._id) {
                      try {
                        navigation.navigate('DetectionDetail', { id: latestDetection._id });
                      } catch {
                        navigation.navigate('History');
                      }
                    } else {
                      navigation.navigate('History');
                    }
                  }}
                >
                  <DetectionCard
                    time={latestTimeStr}
                    type={latestTypeStr}
                    description={latestDescription}
                    imageUri={latestImageUri} // ALWAYS a string now ('' when none)
                  />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <Text style={styles.noLatestText}>No recent detections</Text>
          )}

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={{ marginTop: 20 }}>
            <ActionButton text="Refresh" backgroundColor="#B9EAB5" onPress={() => fetchData()} />
            <View style={{ height: 12 }} />
            <ActionButton text="Live Feed" backgroundColor="#B9EAB5" onPress={() => navigation.navigate('LiveFeedScreen')} />
          </View>
        </>
      )}
    </ScrollView>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 50,
    marginBottom: 12,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
    color: '#222',
  },
  noLatestText: {
    color: '#666',
    marginTop: 10,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
  liveBadge: {
    position: 'absolute',
    right: 8,
    top: -10,
    backgroundColor: '#ff3b30',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 14,
    zIndex: 20,
    alignSelf: 'flex-end',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  liveText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
});
