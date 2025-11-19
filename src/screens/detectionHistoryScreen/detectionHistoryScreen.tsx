// import React from 'react';
// import { View, FlatList, StyleSheet, Text } from 'react-native';
// import HistoryItem from '../../components/HistoryItem';

// const DetectionHistoryScreen = () => {
//   const historyData = [
//     { id: '1', title: 'Animal Intrusion Detected', date: 'July 20, 2024, 10:30 AM', imageUri: 'https://placedog.net/80/80' },
//     { id: '2', title: 'Animal Intrusion Detected', date: 'July 19, 2024, 03:45 PM', imageUri: 'https://placekitten.com/80/80' },
//     { id: '3', title: 'Animal Intrusion Detected', date: 'July 18, 2024, 08:15 AM', imageUri: 'https://placebear.com/80/80' },
//     { id: '4', title: 'Animal Intrusion Detected', date: 'July 17, 2024, 06:00 PM', imageUri: 'https://placekitten.com/81/81' },
//     { id: '5', title: 'Animal Intrusion Detected', date: 'July 16, 2024, 11:20 AM', imageUri: 'https://placebear.com/81/81' },
//     { id: '6', title: 'Animal Intrusion Detected', date: 'July 15, 2024, 02:50 PM', imageUri: 'https://placedog.net/81/81' },
//   ];

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <Text style={styles.headerTitle}>Detection History</Text>

//       {/* List */}
//       <FlatList
//         data={historyData}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <HistoryItem
//             title={item.title}
//             date={item.date}
//             imageUri={item.imageUri}
//           />
//         )}
//         contentContainerStyle={{ paddingVertical: 12 }}
//       />
//     </View>
//   );
// };

// export default DetectionHistoryScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     paddingHorizontal: 16,
//     paddingTop: 16,
//   },
//   headerTitle: {
//     fontSize: 24,
//     fontWeight: '600',
//     textAlign: 'center',
//     marginBottom: 12,
//     color: '#333',
//   },
// });

// DetectionHistoryScreen.tsx
import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  ActivityIndicator,
  RefreshControl,
  Modal,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import HistoryItem from '../../components/HistoryItem';
import { io } from 'socket.io-client';

type DetectionItem = {
  _id: string;
  userId?: string | null;
  source?: string;
  phoneId?: string | null;
  timestamp: string;
  count: number;
  detections: { label: string; confidence: number; box?: any }[];
  imagePath?: string | null;
};

const API_BASE = 'http://10.0.2.2:5000';
const SOCKET_URL = API_BASE;

const DetectionHistoryScreen: React.FC = () => {
  const [items, setItems] = useState<DetectionItem[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalImageUri, setModalImageUri] = useState<string>('');
  const socketRef = useRef<any | null>(null);

  // use ref to prevent fetchPage dependency loops
  const loadingRef = useRef(false);
  const loadingMoreRef = useRef(false);

  const makeImageUrl = (imagePath?: string | null) => {
    if (!imagePath) return ''; // never undefined
    if (imagePath.startsWith('http')) return imagePath;
    const path = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
    return `${API_BASE}/${path}`;
  };

  // Stable fetchPage (depends only on limit)
  const fetchPage = useCallback(async (p = 1, replace = false) => {
    if (loadingRef.current && p !== 1) return;
    try {
      if (p === 1) {
        setLoading(true);
        loadingRef.current = true;
      } else {
        loadingMoreRef.current = true;
      }

      const resp = await fetch(`${API_BASE}/api/detections/history?page=${p}&limit=${limit}`);
      if (!resp.ok) {
        const txt = await resp.text();
        throw new Error(`Error ${resp.status}: ${txt}`);
      }
      const json = await resp.json();
      const newData: DetectionItem[] = json.data || [];

      setHasMore(p < (json.totalPages ?? 1));
      setPage(p);
      setItems(prev => (replace ? newData : [...prev, ...newData]));
    } catch (err: any) {
      console.warn('Failed to load history', err);
      Alert.alert('Error', err.message || 'Failed to load history');
    } finally {
      setLoading(false);
      loadingRef.current = false;
      setRefreshing(false);
      loadingMoreRef.current = false;
    }
  }, [limit]);

  // Initial load only (runs once)
  useEffect(() => {
    fetchPage(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally empty - fetchPage is stable

  // Socket initialization in a separate effect (runs once)
  useEffect(() => {
    socketRef.current = io(SOCKET_URL, { transports: ['websocket'] });

    socketRef.current.on('connect', () => {
      console.log('socket connected', socketRef.current.id);
    });

    const onAnimalDetected = (payload: any) => {
      const incoming: DetectionItem = {
        _id: payload._id || payload.id || `local-${Date.now()}`,
        userId: payload.userId ?? null,
        source: payload.source ?? 'mobile',
        phoneId: payload.phoneId ?? null,
        timestamp: payload.timestamp ?? new Date().toISOString(),
        count: payload.count ?? (payload.detections ? payload.detections.length : 1),
        detections: payload.detections ?? [],
        imagePath: payload.imagePath ?? null,
      };

      setItems(prev => {
        if (prev.find(i => i._id === incoming._id)) return prev;
        return [incoming, ...prev];
      });
    };

    socketRef.current.on('animalDetected', onAnimalDetected);

    socketRef.current.on('disconnect', () => {
      console.log('socket disconnected');
    });

    socketRef.current.on('connect_error', (err: any) => {
      console.warn('socket connect_error', err?.message ?? err);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.off('animalDetected', onAnimalDetected);
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []); // empty deps -> runs once

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPage(1, true);
  }, [fetchPage]);

  const loadMore = () => {
    if (!hasMore || loadingRef.current || loadingMoreRef.current) return;
    fetchPage(page + 1, false);
  };

  const openModal = (imagePath?: string | null) => {
    const uri = makeImageUrl(imagePath);
    setModalImageUri(uri);
    setModalVisible(true);
  };

  const renderItem = ({ item }: { item: DetectionItem }) => {
    const imageUri = makeImageUrl(item.imagePath);
    const label = item.detections?.[0]?.label ?? 'Unknown';
    const confidence = item.detections?.[0]?.confidence ?? 0;
    return (
      <HistoryItem
        id={item._id}
        title="Animal Intrusion Detected"
        date={new Date(item.timestamp).toLocaleString()}
        imageUri={imageUri}
        label={label}
        confidence={confidence}
        onPressImage={() => openModal(item.imagePath)}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Detection History</Text>

      {loading && items.length === 0 ? (
        <ActivityIndicator style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() =>
            loadingMoreRef.current ? <ActivityIndicator style={{ margin: 12 }} /> : null
          }
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={{ paddingVertical: 12, paddingHorizontal: 16 }}
        />
      )}

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <TouchableOpacity style={styles.modalCloseArea} onPress={() => setModalVisible(false)} />
          <View style={styles.modalContent}>
            {modalImageUri ? (
              <Image source={{ uri: modalImageUri }} style={styles.modalImage} resizeMode="contain" />
            ) : (
              <Text style={{ color: '#fff' }}>No image</Text>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default DetectionHistoryScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerTitle: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 12,
    color: '#333',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
  },
  modalCloseArea: { flex: 1 },
  modalContent: {
    height: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalImage: { width: '100%', height: '100%' },
});
