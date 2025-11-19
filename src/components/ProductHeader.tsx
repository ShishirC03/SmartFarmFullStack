import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import BackArrow from '../assets/svg/BackArrow';
import { AuthStackParamList } from '../navigation/rootStackParamList';

interface ProductHeaderProps {
  title: string;
}

const ProductHeader: React.FC<ProductHeaderProps> = ({ title }) => {
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      console.warn('⚠️ Cannot go back. Maybe first screen.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleBack} style={styles.backIcon} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <BackArrow width={24} height={24} />
      </TouchableOpacity>

      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

export default ProductHeader;

const styles = StyleSheet.create({
  container: {
    height: 48,
    justifyContent: 'center',
    marginBottom: 24,
  },
  backIcon: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
  },
});
