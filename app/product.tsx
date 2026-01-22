import { StyleSheet, TouchableOpacity, Image, View, Text } from 'react-native';
import { router } from 'expo-router';
import { useInspection } from '@/services/inspection-context';
import { MOCK_PRODUCT_IMAGE } from '@/constants/mock-data';

export default function ProductScreen() {
  const { components, setCurrentComponentIndex } = useInspection();

  const handleNext = () => {
    if (components.length > 0) {
      setCurrentComponentIndex(0);
      router.push('/component');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={{ uri: MOCK_PRODUCT_IMAGE }}
          style={styles.productImage}
          resizeMode="contain"
        />
        <Text style={styles.label}>Product to Inspect</Text>
        
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: 20,
  },
  productImage: {
    width: '90%',
    height: 400,
    marginBottom: 20,
    borderRadius: 8,
  },
  label: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#000000',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#000000',
    paddingHorizontal: 60,
    paddingVertical: 16,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
