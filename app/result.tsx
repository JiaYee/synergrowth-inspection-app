import { StyleSheet, TouchableOpacity, Image, View, Text } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useInspection } from '@/services/inspection-context';

export default function ResultScreen() {
  const params = useLocalSearchParams();
  const machineResult = params.machineResult as 'PASS' | 'FAIL';
  const confidence = parseFloat(params.confidence as string);
  const imageUri = params.imageUri as string;

  const { reset } = useInspection();

  const handleDone = () => {
    reset();
    router.push('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Component Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: imageUri }}
            style={styles.componentImage}
            resizeMode="contain"
          />
          <View style={styles.imageBorder} />
        </View>

        {/* Result Display */}
        <Text style={styles.resultText}>
          Result: {machineResult}
        </Text>
        <Text style={styles.confidenceText}>
          Confidence: {(Math.floor(confidence * 10000) / 100).toFixed(2)}%
        </Text>

        {/* Done Button */}
        <TouchableOpacity
          style={styles.doneButton}
          onPress={handleDone}
        >
          <Text style={styles.buttonText}>Done</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  imageContainer: {
    width: '80%',
    aspectRatio: 1,
    marginBottom: 20,
    position: 'relative',
  },
  componentImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  imageBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 3,
    borderColor: '#FF0000',
    borderRadius: 8,
  },
  resultText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000000',
  },
  confidenceText: {
    fontSize: 16,
    marginBottom: 30,
    color: '#666666',
  },
  doneButton: {
    width: '100%',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    minHeight: 50,
    justifyContent: 'center',
    backgroundColor: '#000000',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
