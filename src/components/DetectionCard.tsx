// src/components/DetectionCard.tsx
import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

type Props = {
  time?: string;
  type?: string;
  description?: string;
  imageUri?: string;
  onPress?: () => void;
  count?: number | string;
};

// Colors per animal type
const COLOR_MAP: Record<string, string> = {
  Monkey: '#001e95ff',
  Goat: '#0d7e00ff',
  cow: '#4FC3F7',
  Nilgai: '#ff4d4dff',
  nilgai: '#ff4d4dff',
  WildBoar: '#99ff00ff',
  default: '#8E97A9',
};

const DetectionCard: React.FC<Props> = ({
  time = '',
  type = 'Unknown',
  description = '',
  imageUri = '',
  onPress,
  count = 1,
}) => {
  const uri = typeof imageUri === 'string' ? imageUri : '';
  const cleanType = (type || 'Unknown').toString();
  const color = COLOR_MAP[cleanType] ?? COLOR_MAP.default;
  const countText = `Count: ${count}`;

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={styles.touchWrapper}>
      <View style={[styles.card, { borderColor: `${color}22` }]}>

        {/* Left accent bar */}
        <View style={[styles.accent, { backgroundColor: color }]} />

        {/* Main content */}
        <View style={styles.content}>
          <Text style={styles.typeText} numberOfLines={1}>{cleanType}</Text>
          <Text style={styles.timeText}>{time}</Text>

          {/* REMOVE the old top count — DO NOT SHOW IT */}
          {/* Description can remain */}
          {/* {description ? <Text style={styles.desc}>{description}</Text> : null} */}

          {/* Bottom stylish count badge */}
          <View style={[styles.bottomBadge, { borderColor: color + '44' }]}>
            <View style={[styles.badgeAccent, { backgroundColor: color }]} />
            <Text style={[styles.badgeText, { color }]}>{countText}</Text>
          </View>
        </View>

        {/* Right image */}
        <View style={styles.imageWrapper}>
          <Image
            source={uri ? { uri } : { uri: 'https://via.placeholder.com/200x150?text=No+Image' }}
            style={styles.image}
            resizeMode="cover"
          />

          {/* Small top-right dot */}
          <View style={[styles.dot, { backgroundColor: color }]} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default DetectionCard;

// ============ STYLES ============
const styles = StyleSheet.create({
  touchWrapper: {
    width: '100%',
    marginBottom: 12,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffffff',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    elevation: 3,
    shadowColor: '#000000ff',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    alignItems: 'center',
  },
  accent: {
    width: 6,
    height: '100%',
    borderRadius: 4,
    marginRight: 10,
  },
  content: {
    flex: 1,
    paddingRight: 8,
  },
  typeText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
  },
  timeText: {
    marginTop: 3,
    fontSize: 13,
    color: '#666',
  },
  desc: {
    marginTop: 6,
    fontSize: 13,
    color: '#444',
  },

  // BOTTOM BADGE
  bottomBadge: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
  },
  badgeAccent: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '700',
  },

  // IMAGE
  imageWrapper: {
    width: 105,
    height: 70,
    borderRadius: 12,
    overflow: 'hidden',
    marginLeft: 10,
    backgroundColor: '#EEE',
    elevation: 4,
    shadowColor: '#000000ff',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  image: {
    width: '100%',
    height: '100%',
  },
  dot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#ffffffff',
  },
});
