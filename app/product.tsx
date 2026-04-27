import { useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Image, View, Text } from 'react-native';
import { router } from 'expo-router';
import { useInspection } from '@/services/inspection-context';

export default function ProductScreen() {
  const { inspectionData, inspectionPoints, currentPointIndex } = useInspection();

  useEffect(() => {
    if (!inspectionData) {
      router.replace('/');
    }
  }, [inspectionData]);

  const handleNext = () => {
    router.push('/camera');
  };

  if (!inspectionData) {
    return null;
  }

  const currentPoint = inspectionPoints[currentPointIndex];
  const totalPoints = inspectionPoints.length;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.imageContainer}>
          {inspectionData.product_image_uri ? (
            <Image
              source={{ uri: inspectionData.product_image_uri }}
              style={styles.productImage}
              resizeMode="contain"
            />
          ) : (
            <View style={[styles.productImage, styles.placeholder]}>
              <Text style={styles.placeholderText}>
                No overview image{'\n'}
                <Text style={styles.placeholderSub}>
                  Reference for this step comes from the inspection point photo.
                </Text>
              </Text>
            </View>
          )}
        </View>
        <Text style={styles.pointLabel}>
          Inspection Point {currentPointIndex + 1} of {totalPoints}
        </Text>
        {currentPoint ? (
          <Text style={styles.pointName}>{currentPoint.name}</Text>
        ) : null}
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
  imageContainer: {
    width: '90%',
    height: 400,
    marginBottom: 12,
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  placeholder: {
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  placeholderText: {
    textAlign: 'center',
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  placeholderSub: {
    fontWeight: '400',
    fontSize: 13,
    color: '#666',
  },
  pointLabel: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    color: '#000000',
  },
  pointName: {
    fontSize: 15,
    color: '#444',
    marginBottom: 8,
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
