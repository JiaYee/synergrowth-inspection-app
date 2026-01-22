import { StyleSheet, TouchableOpacity, Image, View, Text } from 'react-native';
import { router } from 'expo-router';
import { useInspection } from '@/services/inspection-context';
import { MOCK_PRODUCT_IMAGE } from '@/constants/mock-data';

export default function ComponentScreen() {
  const { components, currentComponentIndex, setCurrentComponentIndex } = useInspection();
  const currentComponent = components[currentComponentIndex];

  if (!currentComponent) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No components to inspect</Text>
      </View>
    );
  }

  const handleNext = () => {
    if (currentComponentIndex < components.length - 1) {
      setCurrentComponentIndex(currentComponentIndex + 1);
    } else {
      // All components inspected, go back to product or finish
      router.back();
    }
  };

  const handleInspect = () => {
    router.push('/camera');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.imageContainer}>
          <Image
            source={MOCK_PRODUCT_IMAGE}
            style={styles.productImage}
            resizeMode="contain"
          />
          {/* Red highlight box overlay */}
          <View
            style={[
              styles.highlightBox,
              {
                left: currentComponent.coordinates.x1,
                top: currentComponent.coordinates.y1,
                width: currentComponent.coordinates.x2 - currentComponent.coordinates.x1,
                height: currentComponent.coordinates.y2 - currentComponent.coordinates.y1,
              },
            ]}
          />
        </View>
        
        <Text style={styles.label}>
          {currentComponent.name} to Inspect
        </Text>
        
        <TouchableOpacity style={styles.button} onPress={handleInspect}>
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
  imageContainer: {
    width: '90%',
    height: 400,
    position: 'relative',
    marginBottom: 20,
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  highlightBox: {
    position: 'absolute',
    borderWidth: 3,
    borderColor: '#FF0000',
    backgroundColor: 'transparent',
  },
  label: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#000000',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#000000',
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
