// HistoryItem.tsx
// import React from 'react';
// import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

// type Props = {
//   id: string;
//   title: string;
//   date: string;
//   imageUri?: string; // always string (fallback '')
//   label?: string;
//   confidence?: number;
//   onPressImage?: () => void;
// };

// const HistoryItem: React.FC<Props> = ({ title, date, imageUri = '', label, confidence, onPressImage }) => {
//   // ensure imageUri is string (never undefined)
//   const uri = typeof imageUri === 'string' ? imageUri : '';

//   return (
//     <View style={styles.card}>
//       <TouchableOpacity onPress={onPressImage} activeOpacity={0.8}>
//        <Image
// source={ uri ? { uri } : require('../assets/placeholder.jpg') }

//   style={styles.thumbnail}
//   resizeMode="cover"
// />
//       </TouchableOpacity>

//       <View style={styles.info}>
//         <Text style={styles.title}>{title}</Text>
//         <Text style={styles.meta}>{date}</Text>
//         <Text style={styles.meta}>
//           {label ? `${label}` : 'Unknown'} {typeof confidence === 'number' ? `· ${(confidence * 100).toFixed(0)}%` : ''}
//         </Text>
//       </View>
//     </View>
//   );
// };

// export default HistoryItem;

// const styles = StyleSheet.create({
//   card: {
//     flexDirection: 'row',
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOpacity: 0.06,
//     shadowRadius: 6,
//     padding: 8,
//     marginBottom: 12,
//     alignItems: 'center',
//   },
//   thumbnail: {
//     width: 88,
//     height: 88,
//     borderRadius: 8,
//     backgroundColor: '#eee',
//   },
//   info: {
//     marginLeft: 12,
//     flex: 1,
//   },
//   title: { fontWeight: '600', fontSize: 16 },
//   meta: { color: '#666', marginTop: 4 },
// });

// src/components/HistoryItem.tsx
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

type Props = {
  id?: string;
  title: string;
  date: string;
  imageUri?: string; // always string (fallback '')
  label?: string;
  confidence?: number; // 0..1
  onPressImage?: () => void;
};

const COLOR_MAP: Record<string, string> = {
  Monkey: '#001e95ff',
  Goat: '#0d7e00ff',
  cow: '#4FC3F7',
  Nilgai: '#ff4d4dff',
  nilgai: '#ff4d4dff',
  WildBoar: '#99ff00ff',
  default: '#8E97A9',
};

const HistoryItem: React.FC<Props> = ({ title, date, imageUri = '', label, confidence, onPressImage }) => {
  const uri = typeof imageUri === 'string' ? imageUri : '';
  const animal = (label || 'Unknown').toString();
  const color = COLOR_MAP[animal] ?? COLOR_MAP.default;
  const confPct = typeof confidence === 'number' ? Math.round(confidence * 100) : null;

  return (
    <View style={styles.container}>
      {/* Left thumbnail */}
      <TouchableOpacity onPress={onPressImage} activeOpacity={0.8}>
        <View style={[styles.thumbWrap, { borderColor: color + '22' }]}>
          <Image
            source={uri ? { uri } : require('../assets/placeholder.jpg')}
            style={styles.thumbnail}
            resizeMode="cover"
          />
          <View style={[styles.thumbDot, { backgroundColor: color }]} />
        </View>
      </TouchableOpacity>

      {/* Right content */}
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>

          {/* confidence badge */}
          {confPct !== null ? (
            <View style={[styles.confBadge, { backgroundColor: color + '20', borderColor: color + '44' }]}>
              <Text style={[styles.confText, { color }]}>{confPct}%</Text>
            </View>
          ) : null}
        </View>

        <Text style={styles.dateText}>{date}</Text>

        <View style={styles.metaRow}>
          <View style={[styles.labelPill, { backgroundColor: color + '10', borderColor: color + '22' }]}>
            <View style={[styles.labelDot, { backgroundColor: color }]} />
            <Text style={[styles.labelText]} numberOfLines={1}>{animal}</Text>
          </View>

          {/* optional description or extra info */}
          <Text style={styles.extraText} numberOfLines={1}>
            {/* keep brief — if you want an extra field, pass it via props */}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default HistoryItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
    alignItems: 'center',
    // subtle shadow
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },

  thumbWrap: {
    width: 84,
    height: 84,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#F3F6F3',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  thumbDot: {
    position: 'absolute',
    right: 8,
    top: 8,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#fff',
  },

  content: {
    flex: 1,
    marginLeft: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
    flex: 1,
  },

  confBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confText: {
    fontSize: 12,
    fontWeight: '800',
  },

  dateText: {
    marginTop: 6,
    color: '#65707A',
    fontSize: 12,
  },

  metaRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  labelPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  labelDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  labelText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1C2830',
  },

  extraText: {
    marginLeft: 12,
    color: '#596274',
    fontSize: 12,
  },
});
