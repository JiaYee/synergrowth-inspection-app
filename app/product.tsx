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
  const refUri = currentPoint?.referenceImageUri?.trim();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.pointLabel}>
          Inspection point {currentPointIndex + 1} of {totalPoints}
        </Text>
        {currentPoint ? (
          <Text style={styles.pointName}>{currentPoint.name}</Text>
        ) : null}

        <Text style={styles.referenceHeading}>Reference — match this when you capture</Text>

        <View style={styles.imageContainer}>
          {refUri ? (
            <Image
              source={{ uri: refUri }}
              style={styles.referenceImage}
              resizeMode="contain"
            />
          ) : (
            <View style={[styles.referenceImage, styles.placeholder]}>
              <Text style={styles.placeholderText}>
                No reference photo for this point. Add one under Manage products → Inspection points.
              </Text>
            </View>
          )}
        </View>

        <Text style={styles.label}>Ready to capture</Text>

        <TouchableOpacity
          style={[styles.button, !refUri && styles.buttonDisabled]}
          onPress={handleNext}
          disabled={!refUri}
        >
          <Text style={styles.buttonText}>Next (open camera)</Text>
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
  pointLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#000000',
  },
  pointName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 12,
    textAlign: 'center',
  },
  referenceHeading: {
    fontSize: 14,
    color: '#444',
    marginBottom: 10,
    textAlign: 'center',
  },
  imageContainer: {
    width: '90%',
    height: 360,
    marginBottom: 16,
  },
  referenceImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  placeholderText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    lineHeight: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    color: '#000000',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#000000',
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '600',
  },
});
